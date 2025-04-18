"use client"

import React, { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Wand2,
    Shuffle,
    Trash2,
    Plus,
    MessageCircle,
    Lightbulb,
    PlusCircle,
    ChevronUp,
    ChevronDown,
    Edit2, Pencil
} from "lucide-react"
import { useTranslation } from "react-i18next"
import {ApiChatCreate, ApiEmployeeItemResp, ApiEmployeeList} from "@/service/api"
import { useNavigate, useParams } from "react-router-dom"
import useSWR from "swr";
import {motion} from "framer-motion";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {EmployeeStatus, EmployeeStatusEnum} from "@/lib/constants/constants";


const demoTopics = [
  "How to enhance user loyalty and brand stickiness through social platforms?",
  "How to design an effective remote team collaboration process?",
  "How to improve development efficiency while maintaining product quality?",
  "How to build a successful corporate culture?",
  "How to formulate effective marketing strategies?",
  "How to enhance the customer service experience?",
  "How to maintain a competitive edge during digital transformation?",
  "How to establish an efficient cross - departmental communication mechanism?",
  "How to optimize the user experience design of products?",
  "How to formulate a sustainable business strategy?"
]

const demoData = [
  {
    id: 1,
    name: "Alexander Reed",
    description: "A 28 - 35-year-old man working as a technical supervisor. He has the ENTJ personality type, excels in system architecture design, values teamwork, is good at innovative thinking, and is enthusiastic about new technologies.",
  },
  {
    id: 2,
    name: "Isabella Lane",
    description: "A 30 - 40-year-old woman serves as the director of user experience design. She has the INFJ personality type, possessing keen observation and empathy. She focuses on user needs analysis and pursues perfection in product experience.",
  },
  {
    id: 3,
    name: "Oliver Fox",
    description: "A 25 - 32-year-old man who is the CEO of a startup. He has the ENTP personality type, is full of entrepreneurial spirit and strategic vision, is good at seizing market opportunities, and excels in cross - border resource integration.",
  },
]


interface Character {
  id: number
  name: string
  description: string
}

export type MeetingData = {
  topic: string
  maxrounds: number
  members: {
    name: string
    description: string
  }[]
}
export default function DiscussionSetup({
  data,
  onStart,
  channelId,
}: {
  channelId: string,
  data: MeetingData,
  onStart: (data: MeetingData) => void
}) {
  const { t } = useTranslation();
  const [topic, setTopic] = useState<string>(data?.topic || "")
  const [maxrounds, setMaxRounds] = useState<number>(data?.maxrounds || 2)
  const [members, setMembers] = useState<Character[]>(data?.members ? data.members.map((m, i) => ({ ...m, id: i + 1 })) : demoData)
  const { toast } = useToast()
  const { appId } = useParams()
  const navigate = useNavigate()

  const isDisabled = !!data

    const { data: employeeList, error,mutate } = useSWR<ApiEmployeeItemResp[]>('ApiEmployeeList', ApiEmployeeList);
    if (error) return <div>{t('home-page.failed-to-load')}</div>;
    if (!employeeList) return (
        <div className="w-full flex items-center justify-center h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

  const addCharacter = () => {
    const newId = members.length > 0 ? Math.max(...members.map((c) => c.id)) + 1 : 1
    setMembers([...members, { id: newId, name: `New character ${newId}`, description: "" }])
  }

  const deleteCharacter = (id: number) => {
    setMembers(members.filter((c) => c.id !== id))
  }

  const updateCharacter = (id: number, field: "name" | "description", value: string) => {
    setMembers(members.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  const startDiscussion = () => {
    if (!topic.trim()) {
      toast({
        title: t('meeting-setting.enter-topic-error'),
        variant: "destructive"
      });
      return;
    }

    if (members.length === 0) {
      toast({
        title: t('meeting-setting.add-character-error'),
        variant: "destructive"
      });
      return;
    }

    const data = {
      topic,
      maxrounds,
      members: members.map(({ name, description }) => ({ name, description })),
    }
    console.log("startDiscussion", data, channelId)
    if (!+channelId) {
      ApiChatCreate(appId!, {
      }).then((res) => {
        sessionStorage.setItem(`meeting-${res.guid}`, JSON.stringify(data));
        navigate(`c/${res.guid}`);
      })
    } else { 
      onStart(data);
    }
  }

  const generateRandomTopic = () => {
    const randomIndex = Math.floor(Math.random() * demoTopics.length)
    setTopic(demoTopics[randomIndex])
  }

  return (
    <TooltipProvider>
      <ScrollArea className="flex-1 w-full">
        <div className="flex justify-center p-4">
        <div className="space-y-4 w-full">
          <div className="max-w-5xl mx-auto mb-4 text-center">
            <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-1">
              <Lightbulb className="w-8 h-8 text-primary" />
              {t('meeting-setting.brainstorming')}
            </h1>
            {/*<p className="mt-1 text-base text-muted-foreground">{t('meeting-setting.stimulate-creativity')}</p>*/}
          </div>

          {/* Topic Section */}
          <Card className="shadow-xs">
            {/*<CardHeader className="space-y-1 py-3 px-4">*/}
            {/*  <div className="flex items-center gap-2">*/}
            {/*    <div className="w-7 h-7 bg-primary/20 rounded-lg flex items-center justify-center">*/}
            {/*      <Wand2 className="w-4 h-4 text-primary" />*/}
            {/*    </div>*/}
            {/*    <h2 className="text-lg font-semibold">{t('meeting-setting.discussion-topic')}</h2>*/}
            {/*  </div>*/}
            {/*</CardHeader>*/}
              <CardContent className="space-y-3 px-4 pb-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 w-full pt-5">
                      <div className="flex items-center gap-2 text-primary">
                          <Wand2 className="h-5 w-5"/>
                          <span className="font-medium">Discussion topic</span>
                      </div>
                      <div className="flex-1">
                          <Input
                              value={topic}
                              onChange={(e) => setTopic(e.target.value)}
                              placeholder="How to enhance user loyalty and brand stickiness through social platforms?"
                              className="h-9"
                              disabled={isDisabled}
                          />
                      </div>
                      <div className="flex items-center gap-3 min-w-[300px]">
                          <span className="text-sm whitespace-nowrap">Dialogue turns: {maxrounds}</span>
                          <Slider
                              value={[maxrounds]}
                              onValueChange={(value) => setMaxRounds(value[0])}
                              max={20}
                              min={1}
                              step={1}
                              disabled={isDisabled}
                          />
                      </div>
                  </div>

                  {/*<div className="flex items-center gap-2">*/}
                  {/*    /!*<div className="w-7 h-7 bg-primary/20 rounded-lg flex items-center justify-center">*!/*/}
                  {/*    /!*    <svg*!/*/}
                  {/*    /!*        viewBox="0 0 24 24"*!/*/}
                  {/*    /!*        className="w-4 h-4 text-primary"*!/*/}
                  {/*    /!*        fill="none"*!/*/}
                  {/*    /!*        stroke="currentColor"*!/*/}
                  {/*    /!*        strokeWidth="2"*!/*/}
                  {/*    /!*    >*!/*/}
                  {/*    /!*        <circle cx="12" cy="8" r="5"/>*!/*/}
                  {/*    /!*        <path d="M3 21v-2a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7v2"/>*!/*/}
                  {/*    /!*    </svg>*!/*/}
                  {/*    /!*</div>*!/*/}
                  {/*    /!*<h2 className="text-lg font-semibold">Assistant</h2>*!/*/}
                  {/*    <div className="flex items-center justify-between mb-4">*/}
                  {/*        <h2 className="text-xl font-bold">Your assistants</h2>*/}
                  {/*        <Button variant="ghost" size="sm" className="gap-1"*/}
                  {/*            // onClick={() => setIsCreating(true)}*/}
                  {/*        >*/}
                  {/*            <PlusCircle className="mr-2 h-4 w-4"/>*/}
                  {/*            <span className="hidden sm:inline">Create</span>*/}
                  {/*        </Button>*/}
                  {/*    </div>*/}
                  {/*</div>*/}
                  <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold">Your assistants</h2>
                      <Button variant="ghost" size="sm" className="gap-1"
                          // onClick={() => setIsCreating(true)}
                      >
                          <PlusCircle className="mr-2 h-4 w-4"/>
                          <span className="hidden sm:inline">Create</span>
                      </Button>
                  </div>

                  <motion.div
                      initial={{opacity: 0, y: 20}}
                      animate={{opacity: 1, y: 0}}
                      transition={{duration: 0.5, delay: 0.2}}
                      className="mb-8 cursor-pointer"
                  >

                      {employeeList.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                              {employeeList.map((employee, index) => {
                                  let color = "";
                                  switch (index % 6) {
                                      case 0:
                                          color = "bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-950/30"
                                          break;
                                      case 1:
                                          color = "bg-yellow-50 dark:bg-yellow-950/20 hover:bg-yellow-100 dark:hover:bg-yellow-950/30"
                                          break;
                                      case 2:
                                          color = "bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-950/30"
                                          break;
                                      case 3:
                                          color = "bg-purple-50 dark:bg-purple-950/20 hover:bg-purple-100 dark:hover:bg-purple-950/30"
                                          break;
                                      case 4:
                                          color = "bg-indigo-50 dark:bg-indigo-950/20 hover:bg-indigo-100 dark:hover:bg-indigo-950/30"
                                          break;
                                      case 5:
                                          color = "bg-pink-50 dark:bg-pink-950/20 hover:bg-pink-100 dark:hover:bg-pink-950/30"
                                          break;
                                  }

                                  return (
                                      <motion.div
                                          initial={{opacity: 0, scale: 0.95}}
                                          animate={{opacity: 1, scale: 1}}
                                          transition={{duration: 0.3, delay: 0.1 * index}}
                                          whileHover={{scale: 1.02}}
                                          key={index}
                                          // onMouseEnter={() => setHoveredCard(employee.id)}
                                          // onMouseLeave={() => setHoveredCard(null)}
                                      >
                                          <div
                                              className={`block border rounded-lg p-4 shadow-xs transition-all duration-300 ${color}`}
                                          >
                                              <div className="flex items-start justify-between">
                                                  <div className="w-full">
                                                      <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-xl">
                                                             <Avatar
                                                                 className="h-16 w-16 border-2 border-background shadow-md">
                                                                <AvatarImage src={employee.avatar} alt={employee.name}/>
                                                            </Avatar>
                                                        </span>
                                                          <span
                                                              className="text-xs px-2 py-0.5 rounded-full bg-background/80 text-muted-foreground">
                                                           {employee.role}
                                                        </span>
                                                      </div>

                                                      <h3 className="font-medium truncate">My name is {employee.name}</h3>
                                                  </div>
                                              </div>
                                          </div>
                                      </motion.div>
                                  )
                              })}
                          </div>
                      ) : (
                          <></>
                          // <EmptyApplications />
                      )}
                  </motion.div>

                  {/*<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">*/}
                  {/*  /!* Character Cards *!/*/}
                  {/*  {members.map((character) => (*/}
                  {/*      <Card key={character.id} className="shadow-xs">*/}
                  {/*        <CardContent className="p-3 space-y-3">*/}
                  {/*          <div className="flex items-start justify-between">*/}
                  {/*            <div className="flex items-center gap-3">*/}
                  {/*              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-primary">*/}
                  {/*                {character.name?.[0]?.toUpperCase()}*/}
                  {/*              </div>*/}
                  {/*              <div className="space-y-1">*/}
                  {/*                <Label>{t('meeting-setting.character-name')}</Label>*/}
                  {/*                <Input*/}
                  {/*                    value={character.name}*/}
                  {/*                    onChange={(e) => updateCharacter(character.id, "name", e.target.value)}*/}
                  {/*                    className="h-8"*/}
                  {/*                    disabled={isDisabled}*/}
                  {/*                />*/}
                  {/*              </div>*/}
                  {/*            </div>*/}
                  {/*            <div className="flex gap-1">*/}
                  {/*              <Tooltip>*/}
                  {/*                <TooltipTrigger asChild>*/}
                  {/*                  <Button size="icon" variant="ghost" onClick={() => deleteCharacter(character.id)} className="h-7 w-7">*/}
                  {/*                    <Trash2 className="w-4 h-4" />*/}
                  {/*                  </Button>*/}
                  {/*                </TooltipTrigger>*/}
                  {/*                <TooltipContent>*/}
                  {/*                  <p>{t('meeting-setting.delete-character')}</p>*/}
                  {/*                </TooltipContent>*/}
                  {/*              </Tooltip>*/}
                  {/*            </div>*/}
                  {/*          </div>*/}

                  {/*          <div className="space-y-1">*/}
                  {/*            <Label>{t('meeting-setting.character-description')}</Label>*/}
                  {/*            <Textarea*/}
                  {/*                value={character.description}*/}
                  {/*                onChange={(e) => updateCharacter(character.id, "description", e.target.value)}*/}
                  {/*                className="min-h-[80px] resize-none text-sm"*/}
                  {/*                maxLength={200}*/}
                  {/*                disabled={isDisabled}*/}
                  {/*            />*/}
                  {/*          </div>*/}
                  {/*        </CardContent>*/}
                  {/*      </Card>*/}
                  {/*  ))}*/}
                  {/*</div>*/}

                  {/*<Button variant="outline" size="sm" onClick={addCharacter} disabled={isDisabled}>*/}
                  {/*    <Plus className="w-4 h-4 mr-2"/>*/}
                  {/*    add new assistant*/}
                  {/*</Button>*/}

                  {/* Action Buttons */}
                  <div className="flex justify-center gap-3 pt-2">
                      <Tooltip>
                          <TooltipTrigger asChild>
                              <Button size="sm" onClick={startDiscussion}
                                      disabled={isDisabled}>{t('meeting-setting.start-discussion')}</Button>
                          </TooltipTrigger>
                          <TooltipContent>
                              <p>{t('meeting-setting.start-discussion-tooltip')}</p>
                          </TooltipContent>
                      </Tooltip>
                  </div>
              </CardContent>
          </Card>

            {/* MaxRounds Setting */}
            {/*  <Card className="shadow-xs">*/}
            {/*      <CardHeader className="space-y-1 py-3 px-4">*/}
            {/*          <div className="flex items-center gap-2">*/}
            {/*              <div className="w-7 h-7 bg-primary/20 rounded-lg flex items-center justify-center">*/}
            {/*                  <MessageCircle className="w-4 h-4 text-primary"/>*/}
            {/*              </div>*/}
            {/*              <h2 className="text-lg font-semibold">{t('meeting-setting.dialogue-turn-setting')}</h2>*/}
            {/*    </div>*/}
            {/*  </CardHeader>*/}
            {/*  <CardContent className="space-y-3 px-4 pb-4">*/}
            {/*    <div className="space-y-1.5">*/}
            {/*      <Label>{t('meeting-setting.dialogue-turns')}: {maxrounds}</Label>*/}
            {/*      <Slider*/}
            {/*          value={[maxrounds]}*/}
            {/*          onValueChange={(value) => setMaxRounds(value[0])}*/}
            {/*          max={20}*/}
            {/*          min={1}*/}
            {/*          step={1}*/}
            {/*          disabled={isDisabled}*/}
            {/*      />*/}
            {/*    </div>*/}
            {/*  </CardContent>*/}
            {/*</Card>*/}
        </div>
        </div>
      </ScrollArea>
    </TooltipProvider>
  )
}
