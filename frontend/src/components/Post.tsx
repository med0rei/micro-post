import type { JSXElement } from "@fluentui/react-components";
import {
  Ellipsis,
  EllipsisVertical,
  ExternalLink,
  HeartPlus,
  Repeat2,
  Reply,
  UserPlus,
} from "lucide-react";

import {
  makeStyles,
  Body1,
  Caption1,
  Button,
  Card,
  CardFooter,
  CardHeader,
  CardPreview,
  Text,
} from "@fluentui/react-components";

const resolveAsset = (asset: string) => {
  const ASSET_URL =
    "https://raw.githubusercontent.com/microsoft/fluentui/master/packages/react-components/react-card/stories/src/assets/";

  return `${ASSET_URL}${asset}`;
};

const useStyles = makeStyles({
  card: {
    margin: "auto",
    maxWidth: "100%",
    padding: "20px",
    width: "720px",
  },
  cardPreview: {
    marginBottom: "5px",
    marginLeft: "20px",
    marginTop: "5px",
  },
});

export const Post = (): JSXElement => {
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <CardHeader
        image={
          <img
            src={resolveAsset("avatar_elvia.svg")}
            alt="Elvia Atkins avatar"
          />
        }
        header={
          <Body1>
            <b>John Smith</b>
            <span>
              <Button
                appearance="transparent"
                icon={<UserPlus />}
                aria-label="Follow"
              />
            </span>
            <div>@john</div>
          </Body1>
        }
        description={<Caption1>5h ago</Caption1>}
        action={
          <Button
            appearance="transparent"
            icon={<EllipsisVertical />}
            aria-label="More options"
          />
        }
      />

      <CardPreview>
        <Text className={styles.cardPreview}>こんにちは！</Text>
      </CardPreview>

      <CardFooter>
        <Button icon={<Reply />}>Reply</Button>
        <Button icon={<HeartPlus />}>Like</Button>
        <Button icon={<Repeat2 />}>Repost</Button>
        <Button icon={<ExternalLink />}>Share</Button>
      </CardFooter>
    </Card>
  );
};
