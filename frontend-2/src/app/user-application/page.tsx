import UserApplication from "../client/user-application";

export interface ISinglePageProps {
  params: { slug: string };
}

async function getUserApplicationPageData(slug: string) {
  //Perform BE fetching operatioins here
  return { slug };
}

export default async function UserApplicationPage(
  props: Readonly<ISinglePageProps>,
) {
  const {
    params: { slug },
  } = props;

  const data = await getUserApplicationPageData(slug);

  return <UserApplication data={data} />;
}
