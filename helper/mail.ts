import Mailgen from "mailgen"
import nodemailer from "nodemailer"

const sendEmail = async (options: {
  email: string
  qrCode?: string
  subject: string
  mailgenContent: Mailgen.Content
 attachments?: nodemailer.SendMailOptions["attachments"]
}) => {
  const mailGenerator = new Mailgen({
    theme: {
    path: process.cwd() + '/node_modules/mailgen/themes/default/index.html',
    plaintextPath: process.cwd() + '/node_modules/mailgen/themes/default/index.txt'
    },
    product: {
      name: "Bus-Ticket",
      link: process.env.DOMAIN!
    }
  })

  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent)
  const generatedHtml = mailGenerator.generate(options.mailgenContent)

const emailHtml = `
  ${generatedHtml}

  <div style="text-align:center;margin-top:30px;">
    <h2>Your Ticket QR Code</h2>

    <img src="${options.qrCode}" width="220" />
  </div>
`

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: Number(process.env.MAILTRAP_SMTP_PORT),
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS
    }
  })

 const mail = {
  from: "no-reply@bus-ticket.com",
  to: options.email,
  subject: options.subject,
  text: emailTextual,
  html: emailHtml,
 attachments: options.attachments

}

  try {
    await transporter.sendMail(mail)
  } catch (error) {
    console.error("Email service failed silently.")
    console.error("Error", error)
  }
}


const bookingConfirmationMailgenContent = (
  username: string,
  trip: { origin: string; destination: string; departureDate: string; departureTime: string,price: number },
  seatNumber: number,
  totalPrice: number,
  passengerCount:number,
  ticketUrl: string
  
) => {
  return {
    body: {
      name: username,
      intro: "Your booking is confirmed! Here are your trip details.",
      table: {
        data: [
       { label: "From",           value:` $ ${trip.origin}`  },
       { label: "To",             value: trip.destination },
       { label: "Departure Date", value: trip.departureDate },
      { label: "Departure Time", value: trip.departureTime },
      { label: "Price",          value: trip.price },
      { label: "Passenger Count", value: passengerCount },
      { label: "Seat Number",    value: seatNumber },
      { label: "Total Price", value: `$ ${totalPrice}` },
        ]
      },
  
    action: {
    instructions: "Please present this QR code when boarding.",
    button: {
    color: "#1a73e8",
    text: "View My Ticket",
    link: ticketUrl
  }
    },
    outro: [
      "Need to cancel? You can do so directly from this email by clicking the link below.",
      `Cancel my reservation: ${process.env.DOMAIN}/bookings/cancel`
      ]
    }
  }
}


const giftTicketMailgenContent = (
  recipientName: string,
  senderName: string,
  trip: { from: string; to: string; departureDate: string; departureTime: string,price: number },
  seatNumber: number,
  qrCodeUrl: string
) => {
  return {
    body: {
      name: recipientName,
      intro: `🎁 ${senderName} has offered you a bus ticket as a gift!`,
      table: {
        data: [
        { label: "From",           value: trip.from },
        { label: "To",             value: trip.to },
        { label: "Departure Date", value: trip.departureDate },
        { label: "Departure Time", value: trip.departureTime },
        { label: "Price",          value: trip.price },
        { label: "Seat Number",    value: seatNumber },
        ]
      },
      action: {
        instructions: "Present this QR code when boarding. It will be scanned and invalidated after use.",
        button: {
          color: "#34a853",
          text: "View My Gift Ticket",
          link: qrCodeUrl
        }
      },
      outro: "Have a great trip! Need help? Just reply to this email."
    }
  }
}


const bookingCancellationMailgenContent = (
  username: string,
  trip: { from: string; to: string; departureDate: string; price: number },
) => {
  return {
    body: {
      name: username,
      intro: "Your reservation has been successfully cancelled.",
      table: {
        data: [
        { label: "From",           value: trip.from },
        { label: "To",             value: trip.to },
        { label: "Departure Date", value: trip.departureDate },
        { label: "Price",          value: trip.price },
        { label: "Status",         value: "❌ Cancelled" },
        ]
      },
      action: {
        instructions: "Want to book a new trip?",
        button: {
          color: "#ea4335",
          text: "Book a New Trip",
          link: `${process.env.DOMAIN}/trips`
        }
      },
      outro: "We hope to see you again soon. Need help? Just reply to this email."
    }
  }
}

export {
  sendEmail,
  bookingConfirmationMailgenContent,
  giftTicketMailgenContent,
  bookingCancellationMailgenContent
}