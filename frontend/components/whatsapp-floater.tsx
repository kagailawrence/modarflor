'use client';
import React from "react";
import { FloatingWhatsApp } from 'react-floating-whatsapp'
const WhatsAppFloater = () => (
  <FloatingWhatsApp
    accountName="Modarflor-ke"
    phoneNumber="+254 722 843995"
    chatMessage="Hello! I would like to know more about your services."
    style={{ zIndex: 9999 }}
    avatar={"/logo.png"}
  />
);

export default WhatsAppFloater;
