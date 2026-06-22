import { makeContentPage } from '@/components/marketing/buildContentPage';

export default makeContentPage('contact', (label) => ({
  label,
  href: 'mailto:hello@partiance.it',
}));
