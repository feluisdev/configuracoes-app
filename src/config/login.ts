export const loginConfig = {  
  texts: {
    welcome: "Bem-vindo ao IGRP",
    description: "Entre com suas credenciais para acessar",
    copyright: "IGRP by NOSi.",
    loginButton: "Entrar Agora",
  },
  sliderPosition: "left" as "left" | "right",
  sliderData: [
    {
      src: "https://images.unsplash.com/photo-1722083854982-2f1516cf263c",
      alt: "Slide 1",
      title: "SISS - Sistema de Informação de Segurança Social",
      description: "Gerenciando benefícios com eficiência e transparência."
    },
    {
      src: "https://images.unsplash.com/photo-1551724277-a947a5bf6f93",
      alt: "Slide 2",
      title: "Inovação na Segurança Social",
      description: "Transformando dados em soluções para nossos beneficiários."
    },
    {
      src: "https://images.unsplash.com/photo-1623930376524-ead3734be423",
      alt: "Slide 3",
      title: "Compromisso com o Futuro",
      description: "Construindo um sistema de segurança social mais forte e resiliente."
    }
  ]
}

export type LoginConfig = typeof loginConfig