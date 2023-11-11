const Entry = () => null;

export default Entry;

export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/blog",
      permanent: false,
    },
  };
}
