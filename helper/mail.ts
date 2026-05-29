import Mailgen from "mailgen";
import { BrevoClient } from "@getbrevo/brevo";
import * as Sentry from "@sentry/nextjs";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { createRequire } from "module"
import path from "path";

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY!,
  maxRetries: 3,
});
const _require = createRequire(import.meta.url);
const mailgenBase = path.dirname(_require.resolve("mailgen/package.json"));

const randomId = Math.floor(Math.random()*1000)

type SendEmailOptions = {
  email: string;
  subject: string;
  mailgenContent: Mailgen.Content;
 
  qrCode?: string;
 
  attachments?: {
    name: string;
    content: string;
  }[];

  ticketInfo?: {
    passengerName: string;
    from: string;
    to: string;
    departureDate: string;
    departureTime: string;
    seatNumber: number;
    passengerCount: number;
    totalPrice: number;
    bookingId: string;
  };
};


const generateTicketPDF = async (
  qrCodeDataUrl: string,
  ticketInfo: NonNullable<SendEmailOptions["ticketInfo"]>
): Promise<string> => {

  const pdfDoc = await PDFDocument.create();


  const page = pdfDoc.addPage([419, 595]);
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

 
  const primaryBlue = rgb(0.1, 0.45, 0.93);  // #1a73e8
  const darkGray = rgb(0.2, 0.2, 0.2);
  const lightGray = rgb(0.85, 0.85, 0.85);
  const white = rgb(1, 1, 1);


  page.drawRectangle({
    x: 0,
    y: height - 80,
    width,
    height: 80,
    color: primaryBlue,
  });

  page.drawText("BUS-TICKET", {
    x: 20,
    y: height - 45,
    size: 22,
    font: fontBold,
    color: white,
  });

  page.drawText("BOARDING PASS", {
    x: 20,
    y: height - 65,
    size: 10,
    font: fontRegular,
    color: rgb(0.8, 0.88, 1),
  });

  
  page.drawText(`#${ticketInfo.bookingId.slice(-8).toUpperCase()}`, {
    x: width - 120,
    y: height - 50,
    size: 10,
    font: fontBold,
    color: white,
  });

  const drawSeparator = (y: number) => {
    page.drawLine({
      start: { x: 20, y },
      end: { x: width - 20, y },
      thickness: 1,
      color: lightGray,
    });
  };


  const drawField = (
    label: string,
    value: string,
    x: number,
    y: number,
    valueSize = 13
  ) => {
    page.drawText(label.toUpperCase(), {
      x,
      y: y + 16,
      size: 7,
      font: fontRegular,
      color: rgb(0.5, 0.5, 0.5),
    });
    page.drawText(value, {
      x,
      y,
      size: valueSize,
      font: fontBold,
      color: darkGray,
    });
  };

 
  const routeY = height - 130;

  drawField("FROM", ticketInfo.from, 20, routeY, 16);

  
  page.drawText("→", {
    x: width / 2 - 10,
    y: routeY,
    size: 18,
    font: fontBold,
    color: primaryBlue,
  });

  drawField("TO", ticketInfo.to, width - 130, routeY, 16);

  drawSeparator(routeY - 20);

  
  const detailsY = routeY - 70;

  drawField("DATE", ticketInfo.departureDate, 20, detailsY);
  drawField("TIME", ticketInfo.departureTime, width / 2 - 40, detailsY);
  drawField("SEAT", String(ticketInfo.seatNumber), width - 100, detailsY);

  drawSeparator(detailsY - 20);


  const passengerY = detailsY - 70;

  drawField("PASSENGER", ticketInfo.passengerName, 20, passengerY);
  drawField(
    "PAX",
    String(ticketInfo.passengerCount),
    width / 2 - 40,
    passengerY
  );
  drawField("TOTAL", `$${ticketInfo.totalPrice}`, width - 100, passengerY);

  drawSeparator(passengerY - 20);

 
  const qrBase64 = qrCodeDataUrl.replace(/^data:image\/png;base64,/, "");
  const qrImageBytes = Buffer.from(qrBase64, "base64");
  const qrImage = await pdfDoc.embedPng(qrImageBytes);

  const qrSize = 150;
  const qrX = (width - qrSize) / 2;
  const qrY = passengerY - 220;

  page.drawRectangle({
    x: qrX - 10,
    y: qrY - 10,
    width: qrSize + 20,
    height: qrSize + 20,
    color: white,
    borderColor: lightGray,
    borderWidth: 1,
  });

  page.drawImage(qrImage, {
    x: qrX,
    y: qrY,
    width: qrSize,
    height: qrSize,
  });

  page.drawText("Scan this QR code when boarding", {
    x: width / 2 - 90,
    y: qrY - 20,
    size: 9,
    font: fontRegular,
    color: rgb(0.5, 0.5, 0.5),
  });


  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height: 30,
    color: rgb(0.95, 0.95, 0.95),
  });

  page.drawText("Thank you for choosing BUS-TICKET", {
    x: width / 2 - 95,
    y: 10,
    size: 8,
    font: fontRegular,
    color: rgb(0.5, 0.5, 0.5),
  });


  const pdfBytes = await pdfDoc.save();
  const pdfBase64 = Buffer.from(pdfBytes).toString("base64");

  return pdfBase64;
};

const sendEmail = async (options: SendEmailOptions) => {
  try {
    if (!process.env.BREVO_API_KEY) {
      throw new Error("BREVO_API_KEY is not defined in environment variables");
    }
    if (!process.env.SENDER_EMAIL) {
      throw new Error("SENDER_EMAIL is not defined in environment variables");
    }
    if (!process.env.DOMAIN) {
      throw new Error("DOMAIN is not defined in environment variables");
    }

 

    const mailGenerator = new Mailgen({
      theme: {
        path: path.join(mailgenBase, "themes", "default", "index.html"),
        plaintextPath: path.join(
          mailgenBase,
          "themes",
          "default",
          "index.txt"
        ),
      },
      product: {
        name: "BUS-TICKET",
        link: process.env.DOMAIN,
      },
    });

    const emailText = mailGenerator.generatePlaintext(options.mailgenContent);
    const emailHtml = mailGenerator.generate(options.mailgenContent);

  
    const finalAttachments: { name: string; content: string }[] = [
      ...(options.attachments ?? []),
    ];

    if (options.qrCode && options.ticketInfo) {
      const pdfBase64 = await generateTicketPDF(
        options.qrCode,
        options.ticketInfo
      );
      finalAttachments.push({
        name: `bus-ticket-${randomId}.pdf`,
        content: pdfBase64,
      });
    }

    const result = await brevo.transactionalEmails.sendTransacEmail({
      to: [{ email: options.email }],
      sender: {
        name: "BUS-TICKET",
        email: process.env.SENDER_EMAIL,
      },
      subject: options.subject,
      htmlContent: emailHtml,
      textContent: emailText,
 
      ...(finalAttachments.length > 0 && { attachment: finalAttachments }),
    });

    return result;
  } catch (error) {
    Sentry.logger.error("Failed to send email", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      email: options.email,
      subject: options.subject,
    });

    Sentry.captureException(error, {
      tags: { section: "email-sending" },
    });

    throw error;
  }
};

const bookingConfirmationMailgenContent = (
  username: string,
  trip: {
    origin: string;
    destination: string;
    departureDate: string;
    departureTime: string;
    price: number;
  },
  seatNumber: number,
  totalPrice: number,
  passengerCount: number,
  ticketUrl: string
): Mailgen.Content => {
  return {
    body: {
      name: username,
      intro: "Your booking is confirmed! Here are your trip details.",
      table: {
        data: [
          { label: "From", value: trip.origin },
          { label: "To", value: trip.destination },
          { label: "Departure Date", value: trip.departureDate },
          { label: "Departure Time", value: trip.departureTime },
          { label: "Price", value: `$${trip.price}` },
          { label: "Passenger Count", value: passengerCount },
          { label: "Seat Number", value: seatNumber },
          { label: "Total Price", value: `$${totalPrice}` },
        ],
      },
      action: {
     
        instructions:
          "Your ticket is attached as a PDF. Please download it and present the QR code when boarding.",
        button: {
          color: "#1a73e8",
          text: "View My Tickets",
          link: ticketUrl,
        },
      },
      outro: [
        "Need to cancel? You can do so directly from this email by clicking the link below.",
        `Cancel my reservation: ${process.env.DOMAIN}/bookings/cancel`,
      ],
    },
  };
};

const giftTicketMailgenContent = (
  recipientName: string,
  senderName: string,
  trip: {
    from: string;
    to: string;
    departureDate: string;
    departureTime: string;
    price: number;
  },
  seatNumber: number,
  qrCodeUrl: string
): Mailgen.Content => {
  return {
    body: {
      name: recipientName,
      intro: `🎁 ${senderName} has offered you a bus ticket as a gift!`,
      table: {
        data: [
          { label: "From", value: trip.from },
          { label: "To", value: trip.to },
          { label: "Departure Date", value: trip.departureDate },
          { label: "Departure Time", value: trip.departureTime },
          { label: "Price", value: `$${trip.price}` },
          { label: "Seat Number", value: seatNumber },
        ],
      },
      action: {
        instructions:
          "Your ticket PDF is attached. Present the QR code when boarding — it will be scanned and invalidated after use.",
        button: {
          color: "#34a853",
          text: "View My Gift Ticket",
          link: qrCodeUrl,
        },
      },
      outro: "Have a great trip! Need help? Just reply to this email.",
    },
  };
};

const bookingCancellationMailgenContent = (
  username: string,
  trip: {
    from: string;
    to: string;
    departureDate: string;
    price: number;
  }
): Mailgen.Content => {
  return {
    body: {
      name: username,
      intro: "Your reservation has been successfully cancelled.",
      table: {
        data: [
          { label: "From", value: trip.from },
          { label: "To", value: trip.to },
          { label: "Departure Date", value: trip.departureDate },
          { label: "Price", value: `$${trip.price}` },
          { label: "Status", value: "❌ Cancelled" },
        ],
      },
      action: {
        instructions: "Want to book a new trip?",
        button: {
          color: "#ea4335",
          text: "Book a New Trip",
          link: `${process.env.DOMAIN}/trips`,
        },
      },
      outro:
        "We hope to see you again soon. Need help? Just reply to this email.",
    },
  };
};

export {
  sendEmail,
  generateTicketPDF,
  bookingConfirmationMailgenContent,
  giftTicketMailgenContent,
  bookingCancellationMailgenContent,
};