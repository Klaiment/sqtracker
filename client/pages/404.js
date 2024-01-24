import React, { useContext } from "react";
import Link from "next/link";
import SEO from "../components/SEO";
import Text from "../components/Text";
import LocaleContext from "../utils/LocaleContext";

const NotFound = () => {
  const { getLocaleString } = useContext(LocaleContext);

  return (
    <>
      <SEO title={getLocaleString("404NotFound")} />
      <Text as="h1" mb={5}>
        404: {getLocaleString("404NotFound")}
      </Text>
      <Text>
        {getLocaleString("404PageDoesNotExist")}{" "}
        <Link href="/" passHref>
          {getLocaleString("404ReturnHome")}
        </Link>
        .
      </Text>
    </>
  );
};

export default NotFound;
