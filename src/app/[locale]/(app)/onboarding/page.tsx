import { setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth/session';
import { getOnboardingReferenceData, getProfileState } from '@/services/onboarding/onboarding.service';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';

export default async function OnboardingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await requireUser();

  // Already onboarded → no reason to be here.
  const state = await getProfileState(user.id);
  if (state?.onboardingCompleted) redirect('/dashboard');

  const refData = await getOnboardingReferenceData();

  return (
    <div className="flex min-h-[70dvh] items-start justify-center pt-4">
      <OnboardingWizard refData={refData} />
    </div>
  );
}
