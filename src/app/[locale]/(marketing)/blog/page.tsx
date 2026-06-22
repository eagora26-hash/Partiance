import { makeContentPage } from '@/components/marketing/buildContentPage';

export default makeContentPage('blog', (label) => ({
  label,
  href: 'mailto:hello@partiance.it?subject=Blog',
}));
