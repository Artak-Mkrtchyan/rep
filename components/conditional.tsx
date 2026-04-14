export const Conditional: React.FC<{ condition: boolean; children: React.ReactNode }> = ({
  condition,
  children,
}) => {
  return condition ? <>{children}</> : null;
};
