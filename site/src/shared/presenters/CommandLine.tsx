type CommandLineProps = {
  shadow: 'yellow' | 'paper';
};

export function CommandLine({ shadow }: CommandLineProps) {
  return <code className={`command command-${shadow}`}>npm create brutal my-app</code>;
}
