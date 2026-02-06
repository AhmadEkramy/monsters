import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Users,
    Calendar,
    Trophy,
    MapPin,
    Plus,
    Trash2,
    Edit3,
    Save,
    X,
    Image as ImageIcon,
    CheckCircle2,
    Star
} from 'lucide-react';
import { useCollection } from '@/hooks/useFirestore';
import { toast } from 'sonner';

export default function Admin() {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState('team');

    if (authLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!isAdmin) return <Navigate to="/login" />;

    return (
        <div className="min-h-screen pt-24 pb-12 bg-background">
            <div className="container mx-auto px-4">
                <header className="mb-10 animate-fade-in-up">
                    <div className="flex items-center gap-3 mb-2 text-primary font-bold tracking-wider uppercase text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        Admin Dashboard
                    </div>
                    <h1 className="text-4xl font-black text-foreground">Control Center</h1>
                    <p className="text-muted-foreground mt-2">Manage your team, events, and records from one place.</p>
                </header>

                <Tabs defaultValue="team" value={activeTab} onValueChange={setActiveTab} className="space-y-8 animate-fade-in">
                    <div className="overflow-x-auto pb-2">
                        <TabsList className="bg-card border border-border h-auto p-1 gap-2">
                            <TabsTrigger value="team" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 px-6">
                                <Users className="w-4 h-4 mr-2" /> Team
                            </TabsTrigger>
                            <TabsTrigger value="events" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 px-6">
                                <Calendar className="w-4 h-4 mr-2" /> Events
                            </TabsTrigger>
                            <TabsTrigger value="competitions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 px-6">
                                <Trophy className="w-4 h-4 mr-2" /> Achievements
                            </TabsTrigger>
                            <TabsTrigger value="trips" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 px-6">
                                <MapPin className="w-4 h-4 mr-2" /> Trips
                            </TabsTrigger>
                            <TabsTrigger value="carousel" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 px-6">
                                <ImageIcon className="w-4 h-4 mr-2" /> Carousel
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="team">
                        <TeamManager />
                    </TabsContent>
                    <TabsContent value="events">
                        <EventsManager />
                    </TabsContent>
                    <TabsContent value="competitions">
                        <CompetitionsManager />
                    </TabsContent>
                    <TabsContent value="trips">
                        <TripsManager />
                    </TabsContent>
                    <TabsContent value="carousel">
                        <CarouselManager />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

// --- Team Manager ---
function TeamManager() {
    const { data: team, add, update, remove } = useCollection('team');
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>({ name: '', position: '', image: '', social: { facebook: '', twitter: '', linkedin: '', github: '' } });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await update(isEditing, formData);
                toast.success('Member updated');
            } else {
                await add(formData);
                toast.success('Member added');
            }
            resetForm();
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const resetForm = () => {
        setIsEditing(null);
        setFormData({ name: '', position: '', image: '', social: { facebook: '', twitter: '', linkedin: '', github: '' } });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 border-border bg-card/50 backdrop-blur-sm self-start">
                <CardHeader>
                    <CardTitle>{isEditing ? 'Edit Member' : 'Add New Member'}</CardTitle>
                    <CardDescription>Enter team member details below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Position</Label>
                            <Input value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Image URL</Label>
                            <Input value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." />
                        </div>
                        <div className="space-y-2">
                            <Label>LinkedIn</Label>
                            <Input value={formData.social.linkedin} onChange={e => setFormData({ ...formData, social: { ...formData.social, linkedin: e.target.value } })} />
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" className="flex-1 bg-primary">{isEditing ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}{isEditing ? 'Update' : 'Add'}</Button>
                            {isEditing && <Button type="button" variant="outline" onClick={resetForm}><X className="w-4 h-4" /></Button>}
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-4">
                {team.map((member: any) => (
                    <Card key={member.id} className="border-border hover:border-primary/30 transition-all">
                        <CardContent className="p-4 flex items-center gap-4">
                            <img src={member.image || 'https://via.placeholder.com/150'} alt={member.name} className="w-12 h-12 rounded-full object-cover" />
                            <div className="flex-1">
                                <h4 className="font-bold">{member.name}</h4>
                                <p className="text-sm text-muted-foreground">{member.position}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => { setIsEditing(member.id); setFormData(member); }}><Edit3 className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => remove(member.id)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

// --- Events Manager ---
function EventsManager() {
    const { data: events, add, update, remove } = useCollection('events');
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>({
        title: '', description: '', date: '', location: '', attendees: '', image: '', status: 'upcoming'
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await update(isEditing, formData);
                toast.success('Event updated');
            } else {
                await add(formData);
                toast.success('Event added');
            }
            resetForm();
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const resetForm = () => {
        setIsEditing(null);
        setFormData({ title: '', description: '', date: '', location: '', attendees: '', image: '', status: 'upcoming' });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 border-border bg-card/50 backdrop-blur-sm self-start">
                <CardHeader>
                    <CardTitle>{isEditing ? 'Edit Event' : 'Add New Event'}</CardTitle>
                    <CardDescription>Add an upcoming or past event.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Input value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} placeholder="e.g. March 15, 2025" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Location</Label>
                            <Input value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Image URL</Label>
                            <Input value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." />
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <select
                                className="w-full bg-background border border-input rounded-md p-2"
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="upcoming">Upcoming</option>
                                <option value="past">Past</option>
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" className="flex-1 bg-primary">{isEditing ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}{isEditing ? 'Update' : 'Add'}</Button>
                            {isEditing && <Button type="button" variant="outline" onClick={resetForm}><X className="w-4 h-4" /></Button>}
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-4">
                {events.map((event: any) => (
                    <Card key={event.id} className="border-border overflow-hidden">
                        <div className="flex gap-4 p-4">
                            <img src={event.image || 'https://via.placeholder.com/150'} className="w-24 h-24 object-cover rounded-lg" />
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-lg">{event.title}</h4>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${event.status === 'upcoming' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                        {event.status}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                                <p className="text-xs mt-2 text-primary">{event.date} • {event.location}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button variant="ghost" size="icon" onClick={() => { setIsEditing(event.id); setFormData(event); }}><Edit3 className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => remove(event.id)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

// --- Competitions & Achievements Manager ---
function CompetitionsManager() {
    const { data: achievements, add: addAchie, update: updateAchie, remove: removeAchie } = useCollection('achievements');
    const { data: comps, add: addComp, update: updateComp, remove: removeComp } = useCollection('competitions');

    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [editType, setEditType] = useState<'achie' | 'comp'>('achie');
    const [formData, setFormData] = useState<any>({ title: '', description: '', date: '', status: '', image: '' });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing) {
                if (editType === 'achie') await updateAchie(isEditing, formData);
                else await updateComp(isEditing, formData);
                toast.success('Record updated');
            } else {
                if (editType === 'achie') await addAchie(formData);
                else await addComp(formData);
                toast.success('Record added');
            }
            resetForm();
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const resetForm = () => {
        setIsEditing(null);
        setFormData({ title: '', description: '', date: '', status: '', image: '' });
    };

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1 border-border bg-card/50 backdrop-blur-sm self-start">
                    <CardHeader>
                        <CardTitle>{isEditing ? 'Edit' : 'Add New'} {editType === 'achie' ? 'Achievement' : 'Competition'}</CardTitle>
                        <CardDescription>Manage your records.</CardDescription>
                        <div className="flex gap-2 mt-4">
                            <Button size="sm" variant={editType === 'achie' ? 'default' : 'outline'} onClick={() => { setEditType('achie'); resetForm(); }}>Achievement</Button>
                            <Button size="sm" variant={editType === 'comp' ? 'default' : 'outline'} onClick={() => { setEditType('comp'); resetForm(); }}>Competition</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label>{editType === 'achie' ? 'Year' : 'Status'}</Label>
                                <Input
                                    value={editType === 'achie' ? formData.date : formData.status}
                                    onChange={e => setFormData({ ...formData, [editType === 'achie' ? 'date' : 'status']: e.target.value })}
                                    placeholder={editType === 'achie' ? "2024" : "Semi-Finalist"}
                                    required
                                />
                            </div>
                            {editType === 'comp' && (
                                <div className="space-y-2">
                                    <Label>Image URL</Label>
                                    <Input value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" className="flex-1 bg-primary">{isEditing ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}{isEditing ? 'Update' : 'Add'}</Button>
                                {isEditing && <Button type="button" variant="outline" onClick={resetForm}><X className="w-4 h-4" /></Button>}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-primary" /> Achievements</h3>
                        <div className="space-y-3">
                            {achievements.map((item: any) => (
                                <Card key={item.id} className="border-border">
                                    <div className="p-4 flex items-center gap-4">
                                        <div className="flex-1">
                                            <h4 className="font-bold">{item.title}</h4>
                                            <p className="text-sm text-muted-foreground">{item.date} • {item.description}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => { setEditType('achie'); setIsEditing(item.id); setFormData(item); }}><Edit3 className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => removeAchie(item.id)}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Star className="w-5 h-5 text-primary" /> Competitions</h3>
                        <div className="space-y-3">
                            {comps.map((item: any) => (
                                <Card key={item.id} className="border-border">
                                    <div className="p-4 flex items-center gap-4">
                                        <div className="flex-1">
                                            <h4 className="font-bold">{item.title}</h4>
                                            <p className="text-sm text-muted-foreground">{item.status} • {item.description}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => { setEditType('comp'); setIsEditing(item.id); setFormData(item); }}><Edit3 className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => removeComp(item.id)}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Trips Manager ---
function TripsManager() {
    const { data: trips, add, update, remove } = useCollection('trips');
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>({
        title: '', description: '', date: '', location: '', images: []
    });
    const [imageUrl, setImageUrl] = useState('');

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await update(isEditing, formData);
                toast.success('Trip updated');
            } else {
                await add(formData);
                toast.success('Trip added');
            }
            resetForm();
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const addImage = () => {
        if (imageUrl) {
            setFormData({ ...formData, images: [...formData.images, imageUrl] });
            setImageUrl('');
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...formData.images];
        newImages.splice(index, 1);
        setFormData({ ...formData, images: newImages });
    };

    const resetForm = () => {
        setIsEditing(null);
        setFormData({ title: '', description: '', date: '', location: '', images: [] });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 border-border bg-card/50 backdrop-blur-sm self-start">
                <CardHeader>
                    <CardTitle>{isEditing ? 'Edit Trip' : 'Add New Trip'}</CardTitle>
                    <CardDescription>Add photos and details of the trip.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Input value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Location</Label>
                            <Input value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Add Image URL</Label>
                            <div className="flex gap-2">
                                <Input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." />
                                <Button type="button" variant="outline" onClick={addImage}><ImageIcon className="w-4 h-4" /></Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.images.map((img: string, i: number) => (
                                    <div key={i} className="relative w-12 h-12">
                                        <img src={img} className="w-full h-full object-cover rounded" />
                                        <button type="button" onClick={() => removeImage(i)} className="absolute -top-1 -right-1 bg-destructive text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"><X /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" className="flex-1 bg-primary">{isEditing ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}{isEditing ? 'Update' : 'Add'}</Button>
                            {isEditing && <Button type="button" variant="outline" onClick={resetForm}><X className="w-4 h-4" /></Button>}
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-4">
                {trips.map((trip: any) => (
                    <Card key={trip.id} className="border-border p-4">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <h4 className="font-bold">{trip.title}</h4>
                                <p className="text-sm text-muted-foreground">{trip.date} • {trip.location}</p>
                                <div className="flex gap-1 mt-2">
                                    {trip.images.slice(0, 3).map((img: string, i: number) => (
                                        <img key={i} src={img} className="w-8 h-8 rounded object-cover border border-border" />
                                    ))}
                                    {trip.images.length > 3 && <div className="w-8 h-8 bg-muted rounded flex items-center justify-center text-[10px]">+{trip.images.length - 3}</div>}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => { setIsEditing(trip.id); setFormData(trip); }}><Edit3 className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => remove(trip.id)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

// --- Carousel Manager ---
function CarouselManager() {
    const { data: slides, add, update, remove } = useCollection('carousel');
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>({ image: '', title: '', subtitle: '' });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await update(isEditing, formData);
                toast.success('Slide updated');
            } else {
                await add(formData);
                toast.success('Slide added');
            }
            resetForm();
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const resetForm = () => {
        setIsEditing(null);
        setFormData({ image: '', title: '', subtitle: '' });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 border-border bg-card/50 backdrop-blur-sm self-start">
                <CardHeader>
                    <CardTitle>{isEditing ? 'Edit Slide' : 'Add New Slide'}</CardTitle>
                    <CardDescription>Manage homepage carousel slides.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Image URL</Label>
                            <Input value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} required placeholder="https://..." />
                        </div>
                        <div className="space-y-2">
                            <Label>Title (Optional)</Label>
                            <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Subtitle (Optional)</Label>
                            <Input value={formData.subtitle} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} />
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" className="flex-1 bg-primary">{isEditing ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}{isEditing ? 'Update' : 'Add'}</Button>
                            {isEditing && <Button type="button" variant="outline" onClick={resetForm}><X className="w-4 h-4" /></Button>}
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-4">
                {slides.map((slide: any) => (
                    <Card key={slide.id} className="border-border overflow-hidden">
                        <div className="flex gap-4 p-4">
                            <img src={slide.image || 'https://via.placeholder.com/150'} className="w-32 h-20 object-cover rounded-lg" />
                            <div className="flex-1">
                                <h4 className="font-bold">{slide.title || 'No Title'}</h4>
                                <p className="text-sm text-muted-foreground">{slide.subtitle || 'No Subtitle'}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button variant="ghost" size="icon" onClick={() => { setIsEditing(slide.id); setFormData(slide); }}><Edit3 className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => remove(slide.id)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
