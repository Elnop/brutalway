import { useTranslation } from 'react-i18next';
import { Card } from './Card.tsx';

export function Native({ name }: { name: string }) {
  const { t } = useTranslation('native');
  return (
    <>
      <input type="submit" value="Send" />
      <input type="button" value={'Go'} />
      <input type="reset" value={`Reset ${name}`} />
      <span aria-placeholder="Type here" />
      <span aria-placeholder={'Type here'} />
      <span aria-roledescription="slide" />
      <span aria-roledescription={`slide of ${name}`} />
      <span aria-valuetext="Half done" />
      <span aria-valuetext={'Half done'} />
      <Card aria-placeholder="Type here" name={name} count={1} />
      <Card aria-roledescription="slide" name={name} count={1} />
      <Card aria-valuetext="Half done" name={name} count={1} />
      <input type="submit" value={t('send')} />
      <input type="text" value={name} />
      <input type="hidden" value="session" />
      <input type="checkbox" value="agree" />
      <option value="first">{t('first')}</option>
      <span aria-valuetext={t('half')} />
      <span aria-placeholder="42" />
      <span aria-roledescription="PET_ID" />
    </>
  );
}
