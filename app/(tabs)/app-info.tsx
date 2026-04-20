import React from 'react';

import InfoPage from '@/components/info-page';

export default function AppInfoScreen() {
  return (
    <InfoPage
      eyebrow="About"
      title="App Info"
      intro="This page provides general information about the app, its purpose, and the kind of services and tools users can access through the platform."
      lastUpdated="April 20, 2026"
      sections={[
        {
          title: 'What This App Does',
          paragraphs: [
            'The app offers digital utility tools designed to help users review content, analyze websites, and complete common optimization tasks more efficiently.',
            'Features may change over time as improvements, fixes, and new tools are added to provide a better user experience.',
          ],
        },
        {
          title: 'Who The App Is For',
          paragraphs: [
            'The app is intended for website owners, marketers, creators, students, and professionals who want practical digital tools in one place.',
            'The app is designed for general informational and productivity use and is not intended to replace professional legal, financial, or technical advice.',
          ],
        },
        {
          title: 'Availability And Updates',
          paragraphs: [
            'Services, features, and interface elements may be updated, suspended, or modified at any time to improve quality, security, and compatibility.',
            'The app owner may release new versions to fix issues, enhance reliability, or support updated devices and operating systems.',
          ],
        },
        {
          title: 'Responsible Use',
          paragraphs: [
            'Users are expected to use the app lawfully, respectfully, and in a manner that does not interfere with the app, other users, or third-party services.',
            'Misuse, abuse, automated attacks, or attempts to bypass app limitations may lead to restrictions or removal of access where necessary.',
          ],
        },
      ]}
    />
  );
}
