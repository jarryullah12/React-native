import React from 'react';

import InfoPage from '@/components/info-page';

export default function ContactUsScreen() {
  return (
    <InfoPage
      eyebrow="Support"
      title="Contact Us"
      intro="Users can contact the app owner for support, feedback, business inquiries, bug reports, or questions about app content and policies."
      lastUpdated="April 20, 2026"
      sections={[
        {
          title: 'General Support',
          paragraphs: [
            'For help with app features, errors, or account-related concerns, users should contact the official support channel provided by the app owner.',
            'When sending a support request, users are encouraged to include clear details such as the device type, app version, and a short explanation of the issue.',
          ],
        },
        {
          title: 'Business And Advertising Inquiries',
          paragraphs: [
            'Business, partnership, and advertising-related inquiries may be submitted through the official contact details shared by the app owner.',
            'All inquiries are reviewed in good faith, but response times may vary depending on request volume and availability.',
          ],
        },
        {
          title: 'Policy Questions',
          paragraphs: [
            'Questions about the Privacy Policy, Terms & Conditions, Disclaimer, or content practices can also be directed to the app owner through the available support method.',
            'Users should ensure that any personal information shared in messages is relevant and necessary for the request being made.',
          ],
        },
        {
          title: 'Official Contact Details',
          paragraphs: [
            'Email: jarryullah46@gmail.com',
            'Phone: +923356471303',
            'Address: Bhutto Calony Sargodha Road Faisalabad Pakistan',
          ],
        },
        {
          title: 'Response Expectations',
          paragraphs: [
            'The app owner aims to review messages in a reasonable time, but an immediate response is not guaranteed.',
            'Messages that are abusive, unlawful, misleading, or irrelevant may be ignored or blocked to protect the service environment.',
          ],
        },
      ]}
    />
  );
}
