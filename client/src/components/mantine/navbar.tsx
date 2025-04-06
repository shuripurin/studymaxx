import { useEffect, useState } from "react";
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
import { Link, useNavigate } from "@tanstack/react-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../app/firebase";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  console.log(isLoggedIn);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    signOut(auth)
      .then(() => {
        console.log("successfully signed out");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const tabs = {
    Profile: "/profile",
    Dashboard: "/dashboard",
    Notes: "/notes",
    Friends: "/friends",
  };

  return (
    <div className={classes.header}>
      <Drawer opened={opened} onClose={close} title="StudyMaxx">
        <div className="flex flex-col items-center gap-2">
          {Object.entries(tabs).map(([tab, path]) => (
            <Button
              key={tab}
              variant="filled"
              color="dark"
              w={275}
              mt="sm"
              onClick={() => {
                navigate({ to: path });
                close();
              }}
            >
              {tab}
            </Button>
          ))}
        </div>
      </Drawer>
      <Burger opened={opened} onClick={open} size="sm" />
      <Text size="md" fw={700}>
        StudyMaxx
      </Text>
      <div className="flex flex-wrap align-center items-center gap-2">
        <Button
          variant="filled"
          color="dark"
          onClick={() => {
            navigate({ to: "/dashboard" });
            close();
          }}
        >
          My Dashboard
        </Button>
        {isLoggedIn ? (
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
                  <IconHeart
                    size={16}
                    color={theme.colors.red[6]}
                    stroke={1.5}
                  />
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
              <Menu.Item
                leftSection={<IconLogout size={16} stroke={1.5} />}
                onClick={handleLogout}
              >
                Logout
              </Menu.Item>

              <Menu.Divider />

              <Menu.Label>Danger zone</Menu.Label>
              <Menu.Item
                leftSection={<IconPlayerPause size={16} stroke={1.5} />}
              >
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
        ) : (
          <Link to="/sign-in">
            <Button>Sign In</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
