interface Props {
  children: React.ReactNode;
}

export const CenterLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-col mx-auto max-w-screen-md relative px-2">
      {children}
    </div>
  );
};
