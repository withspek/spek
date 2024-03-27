interface Props {
  children: React.ReactNode;
}

export const CenterLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex max-w-screen-sm mx-auto w-full h-full flex-col relative">
      {children}
    </div>
  );
};
