import React from 'react';

import InfoPage from '@/components/info-page';

export default function TermsAndConditionsScreen() {
  return (
    <InfoPage
      eyebrow="Terms"
      title="Terms & Conditions"
      intro="These Terms & Conditions describe the basic rules for using the app, its content, and its tools. By using the app, users agree to follow these terms."
      lastUpdated="April 20, 2026"
      sections={[
        {
          title: 'Acceptance Of Terms',
          paragraphs: [
            'By accessing or using the app, users agree to comply with these Terms & Conditions and all applicable laws and regulations.',
            'If a user does not agree with these terms, that user should stop using the app and its services.',
          ],
        },
        {
          title: 'Use Of The App',
          paragraphs: [
            'The app may be used only for lawful purposes and in a manner that does not damage, disrupt, overload, or interfere with the service or related systems.',
            'Users must not misuse the app for spam, unauthorized scraping, illegal activity, security abuse, or deceptive conduct.',
          ],
        },
        {
          title: 'Content And Intellectual Property',
          paragraphs: [
            'The app interface, branding, content structure, and related materials may be protected by intellectual property laws and remain the property of the app owner or their licensors.',
            'Users may not reproduce, distribute, modify, or exploit app content beyond what is legally permitted without prior authorization.',
          ],
        },
        {
          title: 'Service Changes',
          paragraphs: [
            'The app owner may update, suspend, restrict, or remove features at any time without prior notice when necessary for maintenance, quality, legal compliance, or service improvement.',
            'Continued use of the app after updates or policy changes may be treated as acceptance of the revised terms where allowed by law.',
          ],
        },
        {
          title: 'Limitation Of Liability',
          paragraphs: [
            'The app is provided on an as-available and as-is basis. The app owner does not guarantee uninterrupted access, perfect accuracy, or results suitable for every situation.',
            'To the extent permitted by law, the app owner is not responsible for indirect, incidental, or consequential losses arising from use of the app.',
          ],
        },
      ]}
    />
  );
}
