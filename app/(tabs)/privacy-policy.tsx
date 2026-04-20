import React from 'react';

import InfoPage from '@/components/info-page';

export default function PrivacyPolicyScreen() {
  return (
    <InfoPage
      eyebrow="Policy"
      title="Privacy Policy"
      intro="This Privacy Policy explains how the app handles information, improves the user experience, and protects user privacy when people use the app and its features."
      lastUpdated="April 20, 2026"
      sections={[
        {
          title: 'Information We May Collect',
          paragraphs: [
            'The app may collect limited technical information such as device type, app version, crash reports, and general usage activity to keep the service stable and improve performance.',
            'If a user contacts the app owner directly, the app owner may receive the name, email address, or message content voluntarily submitted by that user.',
          ],
        },
        {
          title: 'How Information Is Used',
          paragraphs: [
            'Information may be used to operate the app, improve features, fix bugs, respond to support requests, understand usage trends, and maintain security.',
            'The app does not sell personal information to third parties. Any use of information is limited to legitimate business, operational, and support purposes.',
          ],
        },
        {
          title: 'Advertising And Analytics',
          paragraphs: [
            'The app may display advertisements or use analytics services that collect non-personal usage data in accordance with their own privacy practices.',
            'Third-party advertising partners may use cookies, device identifiers, or similar technologies to deliver relevant ads, measure performance, and prevent invalid activity.',
          ],
        },
        {
          title: 'Data Security',
          paragraphs: [
            'Reasonable technical and organizational measures are used to protect data from unauthorized access, misuse, disclosure, or loss.',
            'No internet-based service can guarantee absolute security, but appropriate care is taken to reduce risk and protect the app environment.',
          ],
        },
        {
          title: 'User Choices',
          paragraphs: [
            'Users may limit certain permissions through device settings and may stop using the app at any time.',
            'Questions about privacy or data handling can be submitted through the Contact Us page.',
          ],
        },
      ]}
    />
  );
}
