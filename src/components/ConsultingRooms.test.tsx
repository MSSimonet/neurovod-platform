import React from 'react';
import { describe, expect, test } from 'vitest';
import { screen, within } from '@testing-library/react';
import { renderConPlataforma } from '../test/render';
import { ConsultingRooms } from './ConsultingRooms';
import { leadDoctor } from '../data/catalog';

describe('consultorios donde atiende', () => {
  test('lista cada consultorio con su ciudad y su dirección', () => {
    renderConPlataforma(<ConsultingRooms />);

    for (const room of leadDoctor.consultingRooms) {
      const ficha = screen.getByRole('heading', { name: room.place }).closest('article')!;

      expect(within(ficha).getByText(new RegExp(room.city))).toBeInTheDocument();
      expect(within(ficha).getByText(room.address)).toBeInTheDocument();
    }
  });

  test('muestra los cuatro lugares de atención', () => {
    renderConPlataforma(<ConsultingRooms />);

    expect(screen.getAllByRole('article')).toHaveLength(leadDoctor.consultingRooms.length);
  });
});

describe('canales para pedir turno', () => {
  test('el WhatsApp es un enlace que abre la conversación', () => {
    renderConPlataforma(<ConsultingRooms />);

    const enlace = screen.getByRole('link', { name: leadDoctor.contact.whatsapp });

    expect(enlace).toHaveAttribute('href', leadDoctor.contact.whatsappUrl);
    expect(enlace).toHaveAttribute('rel', 'noreferrer');
  });

  test('el Instagram enlaza al perfil del profesional', () => {
    renderConPlataforma(<ConsultingRooms />);

    const enlace = screen.getByRole('link', { name: `@${leadDoctor.contact.instagramUser}` });

    expect(enlace).toHaveAttribute('href', leadDoctor.contact.instagramUrl);
  });

  test('los teléfonos se muestran tal como los dicta el consultorio, sin enlace', () => {
    renderConPlataforma(<ConsultingRooms />);

    // Armar un `tel:` obligaría a inventarles un prefijo internacional.
    for (const phone of leadDoctor.contact.phones) {
      const item = screen.getByText(phone);

      expect(item).toBeInTheDocument();
      expect(item.closest('a')).toBeNull();
    }
  });
});
