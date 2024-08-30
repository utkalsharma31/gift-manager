import emailjs from 'emailjs-com';

export const sendInvitation = async (guestEmail, guestName, eventName) => {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const userId = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;

  const templateParams = {
    guest_name: guestName,
    guest_email: guestEmail,
    event_name: eventName,
  };

  try {
    const response = await emailjs.send(serviceId, templateId, templateParams, userId);
    console.log('Email sent successfully:', response);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};
