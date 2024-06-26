import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from "react-plaid-link";
import { createLinkToken, exchangePublicToken } from "@/lib/actions/user.actions";

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
  const router = useRouter();
  const [token, setToken] = React.useState("");

  React.useEffect(() => {
    const fetchToken = async () => {
      const data = await createLinkToken(user);
        setToken(data?.linkToken);
    };

    fetchToken();
  }, [user]);
  
  const onSuccess = React.useCallback<PlaidLinkOnSuccess>(
    async (public_token: string) => {
      await exchangePublicToken({
          publicToken: public_token,
          user
      });

      router.push("/");
    },
    [user]
  );

  const config: PlaidLinkOptions = {
    token,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <>
      {variant === "primary" ? (
        <Button onClick={() => open} disabled={!ready} className="plaidlink-primary">Connect bank</Button>
      ) : variant === "ghost" ? (
        <Button className="">Connect bank</Button>
      ) : (
        <Button>Connect bank</Button>
      )}
    </>
  );
};

export default PlaidLink;
