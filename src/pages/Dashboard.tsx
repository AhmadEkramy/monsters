import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCollection } from '@/hooks/useFirestore';
import { Card } from '@/components/ui/card';
import {
    Send,
    MessageSquare,
    Smile,
    Reply,
    X,
    MoreHorizontal,
    ThumbsUp,
    Heart,
    Laugh,
    User
} from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { orderBy } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Trash2, Edit3, AlertTriangle } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface Message {
    id: string;
    text: string;
    userId: string;
    userName: string;
    createdAt: any;
    replyTo?: {
        id: string;
        text: string;
        userName: string;
    };
    reactions?: Record<string, string[]>; // emoji -> list of userIds
    userPhoto?: string;
    isEdited?: boolean;
}

export default function Dashboard() {
    const { user, userData, loading: authLoading } = useAuth();
    const { t } = useLanguage();
    const [messageText, setMessageText] = useState('');
    const [replyTo, setReplyTo] = useState<Message['replyTo'] | null>(null);
    const [editingMsg, setEditingMsg] = useState<Message | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const { data: messages, add, update, remove } = useCollection<Message>('messages', [
        orderBy('createdAt', 'asc')
    ]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    if (authLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!user) return <Navigate to="/login" />;

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageText.trim()) return;

        if (editingMsg) {
            await update(editingMsg.id, {
                text: messageText,
                isEdited: true
            });
            setEditingMsg(null);
        } else {
            await add({
                text: messageText,
                userId: user.uid,
                userName: userData?.name || user.displayName || 'Monster',
                userPhoto: userData?.photoURL || user.photoURL || null,
                createdAt: new Date(),
                ...(replyTo && { replyTo }),
                reactions: {}
            });
        }

        setMessageText('');
        setReplyTo(null);
    };

    const handleEdit = (msg: Message) => {
        setEditingMsg(msg);
        setMessageText(msg.text);
        setReplyTo(null);
    };

    const handleRemoveMessage = async (msgId: string) => {
        await remove(msgId);
    };

    const handleReaction = async (message: Message, emoji: string) => {
        const reactions = message.reactions || {};
        const userIds = reactions[emoji] || [];

        const newUserIds = userIds.includes(user.uid)
            ? userIds.filter(id => id !== user.uid)
            : [...userIds, user.uid];

        await update(message.id, {
            reactions: {
                ...reactions,
                [emoji]: newUserIds
            }
        });
    };

    return (
        <div className="min-h-screen pt-20 pb-6 bg-background flex flex-col h-screen overflow-hidden">
            <div className="container mx-auto px-4 flex-1 flex flex-col max-w-5xl h-full">
                {/* Header */}
                <header className="mb-6 flex items-center justify-between animate-fade-in-up flex-shrink-0">
                    <div>
                        <div className="flex items-center gap-2 text-primary font-bold tracking-wider uppercase text-xs mb-1">
                            <MessageSquare className="w-4 h-4" />
                            Monsters Lounge
                        </div>
                        <h1 className="text-2xl font-black text-foreground">Team Discussion</h1>
                    </div>
                </header>

                {/* Chat Container */}
                <Card className="flex-1 border-border bg-card/50 backdrop-blur-xl flex flex-col overflow-hidden mb-4 shadow-2xl relative">
                    {/* Background Glows */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -ml-32 -mb-32 pointer-events-none" />

                    {/* Messages Area */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-hide"
                    >
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 space-y-4">
                                <MessageSquare className="w-12 h-12" />
                                <p>Start the conversation! Say something to the team.</p>
                            </div>
                        ) : (
                            messages.map((msg, i) => {
                                const isOwn = msg.userId === user.uid;
                                return (
                                    <div
                                        key={msg.id}
                                        className={cn(
                                            "flex flex-col animate-fade-in group/item",
                                            isOwn ? "items-end" : "items-start"
                                        )}
                                    >
                                        <div className={cn(
                                            "flex items-end gap-2 max-w-[85%] md:max-w-[70%]",
                                            isOwn ? "flex-row-reverse" : "flex-row"
                                        )}>
                                            {/* Avatar Link to Profile */}
                                            <Link
                                                to={`/profile/${msg.userId}`}
                                                className="w-8 h-8 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center flex-shrink-0 border border-primary/20 shadow-sm hover:scale-110 transition-transform cursor-pointer"
                                            >
                                                {msg.userPhoto ? (
                                                    <img src={msg.userPhoto} alt={msg.userName} className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-4 h-4 text-primary" />
                                                )}
                                            </Link>

                                            {/* Message Bubble Container */}
                                            <div className="flex flex-col space-y-1">
                                                {/* User Name Link to Profile */}
                                                <Link
                                                    to={`/profile/${msg.userId}`}
                                                    className={cn(
                                                        "text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1 hover:text-primary transition-colors cursor-pointer",
                                                        isOwn ? "text-right" : "text-left"
                                                    )}
                                                >
                                                    {msg.userName}
                                                </Link>

                                                {/* Content Bubble */}
                                                <div className={cn(
                                                    "relative p-3 md:p-4 rounded-2xl group transition-all duration-300",
                                                    isOwn
                                                        ? "bg-primary text-primary-foreground rounded-tr-none shadow-[0_4px_15px_rgba(78,240,55,0.2)]"
                                                        : "bg-muted/50 backdrop-blur-sm text-foreground rounded-tl-none border border-border/50"
                                                )}>
                                                    {/* Reply Source Display */}
                                                    {msg.replyTo && (
                                                        <div className={cn(
                                                            "mb-2 p-2 rounded-lg text-xs border-l-2 flex flex-col opacity-80",
                                                            isOwn ? "bg-black/10 border-white/30" : "bg-primary/5 border-primary/30"
                                                        )}>
                                                            <span className="font-black text-[10px] uppercase">{msg.replyTo.userName}</span>
                                                            <span className="line-clamp-1 italic">{msg.replyTo.text}</span>
                                                        </div>
                                                    )}

                                                    <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>

                                                    {/* Edited Label */}
                                                    {msg.isEdited && (
                                                        <span className="text-[9px] italic opacity-40 ml-1">(edited)</span>
                                                    )}

                                                    {/* Timestamp */}
                                                    <span className={cn(
                                                        "text-[9px] mt-1 block opacity-50",
                                                        isOwn ? "text-right" : "text-left"
                                                    )}>
                                                        {msg.createdAt?.seconds ? format(msg.createdAt.seconds * 1000, 'HH:mm') : '...'}
                                                    </span>

                                                    {/* Quick Actions Hover */}
                                                    <div className={cn(
                                                        "absolute top-0 opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-1 transform -translate-y-[120%] mb-1 bg-card/95 backdrop-blur-md border border-border rounded-full p-1 shadow-2xl z-20 scale-90 group-hover:scale-100",
                                                        isOwn ? "right-0" : "left-0"
                                                    )}>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                                            onClick={() => setReplyTo({ id: msg.id, text: msg.text, userName: msg.userName })}
                                                        >
                                                            <Reply className="w-4 h-4" />
                                                        </Button>
                                                        {isOwn && (
                                                            <>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                                                    onClick={() => handleEdit(msg)}
                                                                >
                                                                    <Edit3 className="w-4 h-4" />
                                                                </Button>
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-8 w-8 rounded-full text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </Button>
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent className="bg-card/95 backdrop-blur-xl border-border">
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle className="flex items-center gap-2">
                                                                                <AlertTriangle className="w-5 h-5 text-destructive" />
                                                                                Delete Message?
                                                                            </AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                This action cannot be undone. This message will be permanently removed from the Monsters Lounge.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel className="bg-muted hover:bg-muted/80">Cancel</AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                onClick={() => handleRemoveMessage(msg.id)}
                                                                                className="bg-destructive hover:bg-destructive/90 text-white"
                                                                            >
                                                                                Confirm Delete
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>
                                                            </>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                                            onClick={() => handleReaction(msg, '👍')}
                                                        >
                                                            <ThumbsUp className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                                            onClick={() => handleReaction(msg, '❤️')}
                                                        >
                                                            <Heart className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Reactions Display */}
                                                <div className={cn(
                                                    "flex flex-wrap gap-1 mt-1",
                                                    isOwn ? "justify-end" : "justify-start"
                                                )}>
                                                    {msg.reactions && Object.entries(msg.reactions).map(([emoji, userIds]) => {
                                                        if (userIds.length === 0) return null;
                                                        return (
                                                            <button
                                                                key={emoji}
                                                                onClick={() => handleReaction(msg, emoji)}
                                                                className={cn(
                                                                    "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] border transition-all",
                                                                    userIds.includes(user.uid)
                                                                        ? "bg-primary/20 border-primary text-primary"
                                                                        : "bg-muted/30 border-border text-muted-foreground hover:border-primary/50"
                                                                )}
                                                            >
                                                                <span>{emoji === '👍' ? '👍' : emoji === '❤️' ? '❤️' : '😂'}</span>
                                                                <span className="font-bold">{userIds.length}</span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-muted/20 border-t border-border/50 relative">
                        {/* Reply Preview */}
                        {replyTo && (
                            <div className="absolute top-0 left-0 right-0 transform -translate-y-full bg-card/95 backdrop-blur-xl border-t border-primary/20 p-2 flex items-center justify-between animate-fade-in">
                                <div className="flex items-center gap-2 text-xs border-l-2 border-primary pl-3">
                                    <Reply className="w-3 h-3 text-primary" />
                                    <div>
                                        <p className="font-black uppercase text-[10px] text-primary">Replying to {replyTo.userName}</p>
                                        <p className="text-muted-foreground line-clamp-1">{replyTo.text}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setReplyTo(null)} className="h-6 w-6">
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        )}

                        <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                            <div className="relative flex-1 group">
                                <Input
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    placeholder="Type a message to the team..."
                                    className="bg-card/50 border-border/50 focus:border-primary/50 h-12 pr-12 transition-all rounded-xl"
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                <Smile className="w-5 h-5" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent align="end" className="w-full p-2 bg-card/95 backdrop-blur-xl border-border shadow-2xl">
                                            <div className="grid grid-cols-5 gap-1">
                                                {['👍', '❤️', '😂', '🔥', '🚀', '🎉', '😍', '🙄', '😢', '✨', '👏', '🙌', '💯', '🤔', '😎'].map(emoji => (
                                                    <Button
                                                        key={emoji}
                                                        type="button"
                                                        variant="ghost"
                                                        className="h-10 w-10 text-xl hover:bg-primary/10 transition-colors p-0"
                                                        onClick={() => setMessageText(prev => prev + emoji)}
                                                    >
                                                        {emoji}
                                                    </Button>
                                                ))}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                disabled={!messageText.trim()}
                                className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(78,240,55,0.3)]"
                            >
                                <Send className="w-5 h-5" />
                            </Button>
                        </form>
                    </div>
                </Card>
            </div>
        </div>
    );
}
