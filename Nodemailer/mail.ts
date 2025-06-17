import nodemailer from "nodemailer"
import handlebars from "handlebars"
import fs from "fs"
import path from "path"

// Polyfill for __dirname in ES modules if needed
const __dirname = path.resolve()

// Configure the transporter (replace with your SMTP credentials)
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
  const templatePath = path.join(__dirname, "templates", `${templateName}.hbs`)
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
      from: process.env.SMTP_FROM || 'no-reply@ ModarFlor.com',
      to: process.env.CONTACT_RECEIVER || 'info@ ModarFlor.com',
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
      from: process.env.SMTP_FROM || 'no-reply@ ModarFlor.com',
      to: email,
      subject: "Thank you for contacting  ModarFlor!",
      html: userHtml,
    })
  } catch (error) {
    logEmail("ContactMailError", { name, email, phone, service }, error)
    throw error
  }
}

// Send mail for Subscription (with template and user confirmation)
export async function sendSubscriptionMail({ email }: { email: string }) {
  try {
    // Admin notification
    const adminHtml = renderTemplate("subscription-admin", { email })
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'no-reply@ ModarFlor.com',
      to: process.env.SUBSCRIPTION_RECEIVER || 'info@ ModarFlor.com',
      subject: `New Subscription` ,
      html: adminHtml,
      replyTo: email,
      cc: process.env.SUBSCRIPTION_CC || undefined,
      bcc: process.env.SUBSCRIPTION_BCC || undefined,
    })
    logEmail("SubscriptionMailSent", { email })

    // User confirmation
    const userHtml = renderTemplate("subscription-user", { email })
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'no-reply@ ModarFlor.com',
      to: email,
      subject: "Thank you for subscribing to  ModarFlor!",
      html: userHtml,
    })
  } catch (error) {
    logEmail("SubscriptionMailError", { email }, error)
    throw error
  }
}
