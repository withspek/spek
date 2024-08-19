import { Button, Icon } from "@spek/ui";

interface MinimizedRoomCardProps {
  onFullScreenClick: () => void;
  leaveLoading?: boolean;
  room: {
    name: string;
    descriptioin: string;
    me: {
      isSpeaker: boolean;
      isMuted: boolean;
      isDeafened: boolean;
      switchMuted: () => void;
      switchDeafened: () => void;
      leave: () => void;
    };
  };
}

export const MinimizedRoomCard: React.FC<MinimizedRoomCardProps> = ({
  onFullScreenClick,
  room,
  leaveLoading,
}) => {
  return (
    <div
      className="bg-primary-900 border border-accent rounded-lg p-4 gap-4 grid max-w-md w-full"
      data-testid="minimized-room-card"
    >
      <div className="gap-1 grid">
        <h4 className="text-primary-100 break-all overflow-hidden">
          {room.name}
        </h4>
        <p className="text-primary-300 overflow-ellipsis overflow-hidden w-auto">
          {room.descriptioin}
        </p>
      </div>
      <div className="flex  flex-row">
        <div className="grid grid-cols-3 gap-2">
          <div
            onClick={room.me.switchMuted}
            className={room.me.isMuted ? "cursor-pointer" : ""}
          >
            {room.me.isMuted ? <Icon name="mic-off" /> : <Icon name="mic" />}
          </div>

          <div
            onClick={room.me.switchDeafened}
            className={room.me.isDeafened ? "cursor-pointer" : ""}
          >
            {room.me.isDeafened ? (
              <Icon name="volume-x" />
            ) : (
              <Icon name="volume-2" />
            )}
          </div>

          <div onClick={onFullScreenClick} className="cursor-pointer">
            <Icon name="expand" />
          </div>
        </div>
        <Button
          transition
          loading={leaveLoading}
          className="flex-grow ml-4"
          onClick={room.me.leave}
          color="destructive"
        >
          Leave
        </Button>
      </div>
    </div>
  );
};
