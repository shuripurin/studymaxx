import { useState } from "react";
import {
  IconChevronDown,
  IconHeart,
  IconLogout,
  IconMessage,
  IconPlayerPause,
  IconSettings,
  IconStar,
  IconSwitchHorizontal,
  IconTrash,
} from "@tabler/icons-react";
import cx from "clsx";
import {
  Avatar,
  Burger,
  Button,
  Drawer,
  Group,
  Menu,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./navbar.module.css";
import { useNavigate } from "@tanstack/react-router";

const user = {
  name: "Jane Spoonfighter",
  email: "janspoon@fighter.dev",
  image:
    "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png",
};

export function Navbar() {
  const theme = useMantineTheme();
  const [opened, { open, close }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const tabs = {
    Profile: "/profile",
    Dashboard: "/dashboard",
    Notes: "/notes",
    Friends: "/friends",
  };

  const navigate = useNavigate();

  return (
    <div className={classes.header}>
      <Drawer opened={opened} onClose={close} title="StudyMaxx">
        {Object.entries(tabs).map(([tab, path]) => (
          <Button
            key={tab}
            variant="light"
            fullWidth
            mt="sm"
            color="black"
            onClick={() => {
              console.log(`${tab} clicked`);
              navigate({ to: path });
              close();
            }}
          >
            {tab}
          </Button>
        ))}
      </Drawer>
      <Burger opened={opened} onClick={open} size="sm" />
      <Text size="md" fw={700}>
        StudyMaxx
      </Text>
      <div className="flex flex-wrap align-center items-center">
        <Button>My Dashboard</Button>
        <Menu
          width={260}
          position="bottom-end"
          transitionProps={{ transition: "pop-top-right" }}
          onClose={() => setUserMenuOpened(false)}
          onOpen={() => setUserMenuOpened(true)}
          withinPortal
        >
          <Menu.Target>
            <UnstyledButton
              className={cx(classes.user, {
                [classes.userActive]: userMenuOpened,
              })}
            >
              <Group gap={7}>
                <Avatar
                  src={user.image}
                  alt={user.name}
                  radius="xl"
                  size={20}
                />
                <Text fw={500} size="sm" lh={1} mr={3}>
                  {user.name}
                </Text>
                <IconChevronDown size={12} stroke={1.5} />
              </Group>
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={
                <IconHeart size={16} color={theme.colors.red[6]} stroke={1.5} />
              }
            >
              Liked posts
            </Menu.Item>
            <Menu.Item
              leftSection={
                <IconStar
                  size={16}
                  color={theme.colors.yellow[6]}
                  stroke={1.5}
                />
              }
            >
              Saved posts
            </Menu.Item>
            <Menu.Item
              leftSection={
                <IconMessage
                  size={16}
                  color={theme.colors.blue[6]}
                  stroke={1.5}
                />
              }
            >
              Your comments
            </Menu.Item>

            <Menu.Label>Settings</Menu.Label>
            <Menu.Item leftSection={<IconSettings size={16} stroke={1.5} />}>
              Account settings
            </Menu.Item>
            <Menu.Item
              leftSection={<IconSwitchHorizontal size={16} stroke={1.5} />}
            >
              Change account
            </Menu.Item>
            <Menu.Item leftSection={<IconLogout size={16} stroke={1.5} />}>
              Logout
            </Menu.Item>

            <Menu.Divider />

            <Menu.Label>Danger zone</Menu.Label>
            <Menu.Item leftSection={<IconPlayerPause size={16} stroke={1.5} />}>
              Pause subscription
            </Menu.Item>
            <Menu.Item
              color="red"
              leftSection={<IconTrash size={16} stroke={1.5} />}
            >
              Delete account
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    </div>
  );
}
