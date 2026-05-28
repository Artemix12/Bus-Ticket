import Mailgen from "mailgen";
import { BrevoClient } from "@getbrevo/brevo";
import * as Sentry from "@sentry/nextjs";

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY!,
  maxRetries: 3,
});

type SendEmailOptions = {
  email: string;
  qrCode?: string;
  subject: string;
  mailgenContent: Mailgen.Content;
  attachments?: {
    name: string;
    content: string;
  }[];
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
       path: process.cwd() + '/node_modules/mailgen/themes/default/index.html',
       plaintextPath: process.cwd() + '/node_modules/mailgen/themes/default/index.txt'
    },

    product: {
      name: "BUS-TICKET",
      link: process.env.DOMAIN,
      },
    });

    const emailText = mailGenerator.generatePlaintext(
      options.mailgenContent
    );

    const generatedHtml = mailGenerator.generate(
      options.mailgenContent
    );

    const emailHtml = `
      ${generatedHtml}

      ${
        options.qrCode
          ? `
        <div style="text-align:center;margin-top:30px;">
          <h2>Your Ticket QR Code</h2>

          <img 
            src="${options.qrCode}" 
            width="220"
            alt="QR Code"
          />
        </div>
      `
          : ""
      }
    `;



    const result = await brevo.transactionalEmails.sendTransacEmail({
      to: [
        {
          email: options.email,
        },
      ],

      sender: {
        name: "BUS-TICKET",
        email: process.env.SENDER_EMAIL,
      },

      subject: options.subject,

      htmlContent: emailHtml,

      textContent: emailText,

      attachment: options.attachments,
    });


    return result;

  } 
  catch (error) {

   Sentry.logger.error("Failed to send email", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      email: options.email,
      subject: options.subject,
    });

    Sentry.captureException(error, {
      tags: {
        section: "email-sending",
      },
    });
  
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

      intro:
        "Your booking is confirmed! Here are your trip details.",

      table: {
        data: [
          {
            label: "From",
            value: trip.origin,
          },

          {
            label: "To",
            value: trip.destination,
          },

          {
            label: "Departure Date",
            value: trip.departureDate,
          },

          {
            label: "Departure Time",
            value: trip.departureTime,
          },

          {
            label: "Price",
            value: `$${trip.price}`,
          },

          {
            label: "Passenger Count",
            value: passengerCount,
          },

          {
            label: "Seat Number",
            value: seatNumber,
          },

          {
            label: "Total Price",
            value: `$${totalPrice}`,
          },
        ],
      },

      action: {
        instructions:
          "Please present this QR code when boarding.",

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
          {
            label: "From",
            value: trip.from,
          },

          {
            label: "To",
            value: trip.to,
          },

          {
            label: "Departure Date",
            value: trip.departureDate,
          },

          {
            label: "Departure Time",
            value: trip.departureTime,
          },

          {
            label: "Price",
            value: `$${trip.price}`,
          },

          {
            label: "Seat Number",
            value: seatNumber,
          },
        ],
      },

      action: {
        instructions:
          "Present this QR code when boarding. It will be scanned and invalidated after use.",

        button: {
          color: "#34a853",

          text: "View My Gift Ticket",

          link: qrCodeUrl,
        },
      },

      outro:
        "Have a great trip! Need help? Just reply to this email.",
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

      intro:
        "Your reservation has been successfully cancelled.",

      table: {
        data: [
          {
            label: "From",
            value: trip.from,
          },

          {
            label: "To",
            value: trip.to,
          },

          {
            label: "Departure Date",
            value: trip.departureDate,
          },

          {
            label: "Price",
            value: `$${trip.price}`,
          },

          {
            label: "Status",
            value: "❌ Cancelled",
          },
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
  bookingConfirmationMailgenContent,
  giftTicketMailgenContent,
  bookingCancellationMailgenContent,
};