"use client"

import { ElementRef, useRef, useState, useTransition } from "react"
import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { updateStream } from "@/actions/stream"
import { toast } from "sonner"
import { UploadDropzone } from "@/lib/uploadthing"
import { useRouter } from "next/navigation"
import { Hint } from "../hint"
import { Trash } from "lucide-react"
import Image from "next/image"

interface InfoModalProps {
    initialName: string
    initialThumbnailUrl: string | null
}

export const InfoModal = ({ initialName, initialThumbnailUrl }: InfoModalProps) => {
    const router = useRouter();

    const [name, setName] = useState(initialName)
    const [thumbnailUrl, setThumbnailUrl] = useState(initialThumbnailUrl)
    const [isPending, startTransition] = useTransition()

    const closeRef = useRef<ElementRef<"button">>(null)

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }

    const onRemove = () => {
        startTransition(() => {
            updateStream({thumbnailUrl: null})
            .then(() => {
                toast.success("Thumbnail remove")
                setThumbnailUrl("")
                closeRef.current?.click()
            })
            .catch(() => toast.error("Something went wrong"))
        })
    }

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        startTransition(() => {
            updateStream({ name })
                .then(() => {
                    toast.success("Stream updated!")
                    closeRef.current?.click()
                })
                .catch(() => toast.error("Something went wrong"))
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant={"link"}
                    size={"sm"}
                    className="ml-auto"
                >
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Edit stream info
                    </DialogTitle>
                </DialogHeader>
                <form className="space-y-14" onSubmit={onSubmit}>
                    <div className="space-y-2">
                        <Label>
                            Name
                        </Label>
                        <Input
                            placeholder="Stream Name"
                            value={name}
                            disabled={isPending}
                            onChange={onChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>
                            Thumbnail
                        </Label>
                        {thumbnailUrl ? (
                            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                                <div className="absolute top-2 right-2 z-10">
                                    <Hint
                                        label="Remove thumbnail" asChild
                                        side="left"
                                    >
                                        <Button
                                            disabled={isPending}
                                            onClick={onRemove}
                                            className="h-auto w-auto p-1.5"
                                            type="button"
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </Hint>
                                </div>
                                <Image
                                    src={thumbnailUrl}
                                    alt="thumbnail"
                                    className="object-cover"
                                    fill
                                />
                            </div>
                        ) : (<div className="roudned-xl border outline-dashed outline-muted">
                            <UploadDropzone
                                endpoint="thumbnailUploader"
                                appearance={{
                                    label: {
                                        color: "#fff"
                                    },
                                    allowedContent: {
                                        color: "#fff"
                                    }
                                }}
                                onClientUploadComplete={(res) => {
                                    setThumbnailUrl(res?.[0]?.url)
                                    router.refresh()
                                    closeRef?.current?.click()
                                }}
                            />
                        </div>)}
                    </div>
                    <div className="flex justify-between">
                        <DialogClose asChild ref={closeRef}>
                            <Button type="button" variant={"ghost"}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            variant={"primary"}
                            type="submit"
                            disabled={isPending}
                        >
                            Save
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}