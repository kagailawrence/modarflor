'use client';
import React from "react";
import { FloatingWhatsApp } from 'react-floating-whatsapp'
const WhatsAppFloater = () => (
  <FloatingWhatsApp
    accountName="Modarflor-ke"
    phoneNumber="+254 722 843995"
    chatMessage="Hello! I would like to know more about your services."
    style={{ zIndex: 9999 }}
    avatar="https://www.facebook.com/photo?fbid=122100533378902404&set=a.122098785104902404"
  />
);

export default WhatsAppFloater;
