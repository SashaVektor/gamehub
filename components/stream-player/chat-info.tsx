import { useMemo } from "react"
import { Hint } from "../hint"
import { Info } from "lucide-react"

interface ChatInfoProps {
    isDelayed: boolean
    isFollowOnly: boolean
}

export const ChatInfo = ({ isDelayed, isFollowOnly }: ChatInfoProps) => {
    const hint = useMemo(() => {
        if (isFollowOnly && !isDelayed) {
            return "Only followers can chat"
        }

        if (isDelayed && !isFollowOnly) {
            return "Messages are delayed by 3 seconds"
        }

        if (isDelayed && isFollowOnly) {
            return "Only followers can chat and messages are delayed by 3 seconds"
        }

        return ""
    }, [isDelayed, isFollowOnly])

    const label = useMemo(() => {
        if (isFollowOnly && !isDelayed) {
            return "Followres only"
        }

        if (isDelayed && !isFollowOnly) {
            return "Slow mode"
        }

        if (isDelayed && isFollowOnly) {
            return "Followers only and slow mode"
        }

        return ""
    }, [isDelayed, isFollowOnly])

    if (!isDelayed && !isFollowOnly) {
        return null
    }

    return (
        <div className="p-2 text-muted-foreground bg-white/5 border border-white/10 w-full rounded-t-md flex items-center gap-x-2">
            <Hint label={hint}>
                <Info className="w-4 h-4"/>
            </Hint>
            <p className="text-sm font-semibold">
                {label}
            </p>
        </div>
    )
}