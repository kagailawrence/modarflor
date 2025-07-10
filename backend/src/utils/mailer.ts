import nodemailer from "nodemailer"
import handlebars from "handlebars"
import fs from "fs"
import path from "path"

// Configure the transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.example.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || "user@example.com",
    pass: process.env.SMTP_PASS || "password",
  },
})

// Helper to load and compile an email template
function renderTemplate(templateName: string, context: Record<string, any>) {
  const templatePath = path.join(__dirname, "email-templates", `${templateName}.hbs`)
  const source = fs.readFileSync(templatePath, "utf8")
  const template = handlebars.compile(source)
  return template(context)
}

// Example: log all sent emails (success/failure)
function logEmail(action: string, details: any, error?: any) {
  const logPath = path.join(__dirname, "email.log")
  const logEntry = `[${new Date().toISOString()}] ${action}: ${JSON.stringify(details)}${error ? `\nError: ${error}` : ""}\n`
  fs.appendFileSync(logPath, logEntry)
}

// Send mail for Contact Us page (with template and user confirmation)
export async function sendContactMail({ name, email, phone, service, message }: {
  name: string
  email: string
  phone: string
  service: string
  message: string
}) {
  try {
    // Admin notification
    const adminHtml = renderTemplate("contact-admin", { name, email, phone, service, message })
    const mailOptions = {
      from: process.env.SMTP_FROM || 'no-reply@modaflor-ke.com',
      to: process.env.CONTACT_RECEIVER || 'info@modaflor-ke.com',
      subject: `Contact Us Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\nMessage: ${message}`,
      html: adminHtml,
      replyTo: email,
      cc: process.env.CONTACT_CC || undefined,
      bcc: process.env.CONTACT_BCC || undefined,
    }
    await transporter.sendMail(mailOptions)
    logEmail("ContactMailSent", { name, email, phone, service })
    // User confirmation
    const userHtml = renderTemplate("contact-user", { name })
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'no-reply@modaflor-ke.com',
      to: email,
      subject: "Thank you for contacting ModaFlor!",
      html: userHtml,
    })
  } catch (error) {
    logEmail("ContactMailError", { name, email, phone, service }, error)
    throw error
  }
}

// Send mail for Schedule page (with template and user confirmation)
export async function sendScheduleMail({ name, email, phone, date, time, message }: {
  name: string
  email: string
  phone: string
  date: string
  time: string
  message: string
}) {
  try {
    // Admin notification
    const adminHtml = renderTemplate("schedule-admin", { name, email, phone, date, time, message })
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'no-reply@modaflor-ke.com',
      to: process.env.CONTACT_RECEIVER || 'info@modaflor-ke.com',
      subject: `New Schedule Request from ${name}`,
      html: adminHtml,
      replyTo: email,
    })
    logEmail("ScheduleMailSent", { name, email, phone, date, time })
    // User confirmation
    const userHtml = renderTemplate("schedule-user", { name, date, time })
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'no-reply@modaflor-ke.com',
      to: email,
      subject: "Your visit is scheduled!",
      html: userHtml,
    })
  } catch (error) {
    logEmail("ScheduleMailError", { name, email, phone, date, time }, error)
    throw error
  }
}

// Send mail for Quote page (with template and user confirmation)
export async function sendQuoteMail(data: any) {
  try {
    // Admin notification
    const adminHtml = renderTemplate("quote-admin", data)
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'no-reply@modaflor-ke.com',
      to: process.env.CONTACT_RECEIVER || 'info@modaflor-ke.com',
      subject: `New Quotation Request from ${data.firstName} ${data.lastName}`,
      html: adminHtml,
      replyTo: data.email,
    })
    logEmail("QuoteMailSent", data)
    // User confirmation
    const userHtml = renderTemplate("quote-user", data)
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'no-reply@modaflor-ke.com',
      to: data.email,
      subject: "Thank you for requesting a quote!",
      html: userHtml,
    })
  } catch (error) {
    logEmail("QuoteMailError", data, error)
    throw error
  }
}
