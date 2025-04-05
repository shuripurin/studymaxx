import {
  ActionIcon,
  Avatar,
  Checkbox,
  Input,
  ScrollArea,
  Text,
} from "@mantine/core";
import { IconHeart, IconX } from "@tabler/icons-react";

const friends = [
  { id: 1, name: "Alice Johnson", initial: "A" },
  { id: 2, name: "Brian Smith", initial: "B" },
  { id: 3, name: "Cindy Lee", initial: "C" },
  { id: 4, name: "Daniel Park", initial: "D" },
  { id: 5, name: "Ella Stone", initial: "E" },
  { id: 6, name: "Frank West", initial: "F" },
  { id: 7, name: "Grace Kim", initial: "G" },
  { id: 8, name: "Henry Zhang", initial: "H" },
  { id: 9, name: "Ivy Nguyen", initial: "I" },
  { id: 10, name: "Jack Lin", initial: "J" },
  { id: 11, name: "Karen Davis", initial: "K" },
  { id: 12, name: "Leo Brown", initial: "L" },
];

export function FriendsList() {
  return (
    <div className="flex flex-row h-full gap-6 px-20 py-6">
      <div className="flex-1 rounded-2xl bg-[#ECE6F0] p-4">
        <Text fw={500} className="mb-2 text-lg">
          My Friends
        </Text>
        <div className="rounded-xl bg-purple-50 p-2">
          <ScrollArea h={600}>
            <div className="space-y-1">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between py-2 px-2 hover:bg-[#FEF7FF] rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <Avatar color="violet" radius="xl" size="sm">
                      {friend.initial}
                    </Avatar>
                    <Text size="sm">{friend.name}</Text>
                  </div>

                  <div className="flex items-center gap-2">
                    <IconX size={16} className="text-gray-800" />
                    <Checkbox size="xs" />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className="w-[300px] flex flex-col items-center gap-4 pt-4">
        <div className="flex flex-row items-center justify-between w-full gap-2">
          <Text size="lg">Add a Friend</Text>
          <ActionIcon size={32} variant="default" aria-label="Add friend icon">
            <IconHeart size={20} />
          </ActionIcon>
        </div>
        <Input placeholder="Username" className="w-full" />
      </div>
    </div>
  );
}
