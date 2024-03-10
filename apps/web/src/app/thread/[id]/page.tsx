type Props = {
  params: { id: string };
};

async function generateMetadata({ params }: Props) {
  const id = params.id;
}

export default function ThreadPage({}: Props) {
  return (
    <div>
      <p></p>
    </div>
  );
}
