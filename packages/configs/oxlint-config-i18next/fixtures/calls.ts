declare function toast(message: string): void;
declare namespace toast {
  function success(message: string): void;
  function error(message: string): void;
}
declare function t(key: string): string;

export function calls(name: string) {
  toast('Saved');
  toast.success('Saved');
  toast.error(`Failed ${name}`);
  alert('Deleted');
  window.alert('Deleted');
  confirm('Are you sure?');
  document.title = 'Home';
  document.title = `Home of ${name}`;
  toast(t('saved'));
  toast.success(t('saved'));
  alert(t('deleted'));
  document.title = t('home');
  document.title = '';
  toast('OK');
  console.log('debug');
  console.error('load failed', name);
  return t('blankTitle');
}
