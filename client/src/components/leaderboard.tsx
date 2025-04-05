import { Table, Text } from "@mantine/core";

export function LeaderBoard() {
  const leaderBoardData = [
    { position: 1, username: "RomanZorro***", symbol: "11,238 pt" },
    { position: 2, username: "DimaBlack***", symbol: "10,600 pt" },
    { position: 3, username: "PavSoloEstonia", symbol: "9,488 pt" },
    { position: 4, username: "EscobarCuba77", symbol: "8,789 pt" },
    { position: 5, username: "ZorroLatino***", symbol: "8,240 pt" },
    { position: 6, username: "RomanZorro***", symbol: "7,600 pt" },
    { position: 7, username: "EscobarCuba77", symbol: "7,231 pt" },
    { position: 8, username: "ZorroLatino***", symbol: "6,522 pt" },
    { position: 9, username: "BlueLaguna1988", symbol: "6,000 pt" },
    { position: 10, username: "BlueLaguna1988", symbol: "2,012 pt" },
  ];

  const rows = leaderBoardData.map((leaderBoard) => {
    const isTopThree = leaderBoard.position <= 3;
    const circleClass = isTopThree
      ? "bg-black text-white"
      : "bg-gray-300 text-black";

    return (
      <Table.Tr key={leaderBoard.position} className="border-none">
        <Table.Td className="border-none py-2">
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold ${circleClass}`}
          >
            {leaderBoard.position}
          </div>
        </Table.Td>
        <Table.Td className="border-none py-2">{leaderBoard.username}</Table.Td>
        <Table.Td className="border-none py-2">{leaderBoard.symbol}</Table.Td>
      </Table.Tr>
    );
  });

  const playerRow = (
    <>
      <Table.Tr className="border-none">
        <Table.Td colSpan={3} className="border-none p-0">
          <div className="border-t-2 border-dotted border-gray-500 w-full" />
        </Table.Td>
      </Table.Tr>

      <Table.Tr className="border-none relative bottom-1">
        <Table.Td className="border-none">
          <div className="w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-semibold bg-[#4B3FBC]">
            45
          </div>
        </Table.Td>
        <Table.Td className="border-none">
          <Text size="sm" fw={500}>
            Your username
          </Text>
        </Table.Td>
        <Table.Td className="border-none">
          <Text size="sm">512 pt</Text>
        </Table.Td>
      </Table.Tr>
    </>
  );

  return (
    <div className="w-full">
      <Table withColumnBorders={false} withRowBorders={false}>
        <Table.Thead className="border-none">
          <Table.Tr className="border-none">
            <Table.Th className="border-none">#</Table.Th>
            <Table.Th className="border-none">Username</Table.Th>
            <Table.Th className="border-none">Points</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody className="border-none">
          {rows}
          {playerRow}
        </Table.Tbody>
      </Table>
    </div>
  );
}
