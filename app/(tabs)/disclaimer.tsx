import React from 'react';

import InfoPage from '@/components/info-page';

export default function DisclaimerScreen() {
  return (
    <InfoPage
      eyebrow="Notice"
      title="Disclaimer"
      intro="This Disclaimer explains the limits of the app content and tools. The app is intended for general informational and productivity purposes only."
      lastUpdated="April 20, 2026"
      sections={[
        {
          title: 'General Information Only',
          paragraphs: [
            'Information, analysis, tool output, and suggestions available in the app are provided for general guidance and convenience only.',
            'The app does not provide legal, tax, medical, investment, or professional advisory services, and users should seek qualified advice where necessary.',
          ],
        },
        {
          title: 'No Guaranteed Results',
          paragraphs: [
            'The app owner does not guarantee accuracy, completeness, availability, ranking improvements, revenue outcomes, or business results from using any feature in the app.',
            'Users are responsible for reviewing and validating any output before relying on it in real-world use.',
          ],
        },
        {
          title: 'Third-Party Services',
          paragraphs: [
            'The app may refer to third-party websites, tools, content, analytics providers, or advertising services. Those services operate independently and may have separate terms and policies.',
            'The app owner is not responsible for third-party content, actions, claims, or service interruptions outside the app environment.',
          ],
        },
        {
          title: 'User Responsibility',
          paragraphs: [
            'Users are solely responsible for how they use the app and any decisions made based on app content, suggestions, reports, or generated material.',
            'By using the app, users accept that the app owner is not liable for losses resulting from misuse, misunderstanding, or reliance on informational outputs.',
          ],
        },
      ]}
    />
  );
}
