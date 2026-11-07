import { HomeIcon } from '@heroicons/react/24/solid';
import { Check } from 'lucide-react';
import { FaBeer } from 'react-icons/fa';
import { Button } from '@third-party/shadcn/button';
import { Input } from '@third-party/shadcn/input';

export function Settings() {
  return (
    <form>
      <Input name="email" />
      <input type="hidden" name="token" value="1" />
      <input name="name" />
      <input type="checkbox" name="news" />
      <textarea name="bio" />
      <button type="submit">Save</button>
      <Button type="button">
        <Check />
        <HomeIcon />
        <FaBeer />
      </Button>
    </form>
  );
}
