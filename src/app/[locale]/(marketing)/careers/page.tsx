import { makeContentPage } from '@/components/marketing/buildContentPage';

export default makeContentPage('careers', (label) => ({
  label,
  href: 'mailto:hello@partiance.it?subject=Careers',
}));
