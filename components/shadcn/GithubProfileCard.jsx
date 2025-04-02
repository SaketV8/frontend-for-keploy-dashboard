import { Card, CardContent } from "@/components/shadcn/ui/card";
import { Avatar, AvatarImage } from "@/components/shadcn/ui/avatar";

const GithubProfileCard = ({ user }) => {
  return (
    <Card className="w-80 p-4 shadow-lg rounded-xl">
      <CardContent className="flex flex-col items-center gap-3">
        <Avatar className="w-20 h-20">
          <AvatarImage src={user.avatar_url} alt={user.name} />
        </Avatar>
        <h2 className="text-xl font-semibold">{user.name}</h2>
        {/* <p className="text-gray-500">{user.email}</p> */}
        <p className="text-gray-600">GitHub: {user.github_username}</p>
        {/* <p className="text-gray-600">GitHub ID: {user.github_id}</p> */}
      </CardContent>
    </Card>
  );
};

export default GithubProfileCard;
