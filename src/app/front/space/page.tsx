"use client"
import React, { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Database, MessageSquare, FileText, Brain, Users, AlertTriangle } from "lucide-react"
import { ApiAppInfo, AppResp as Space } from "@/service/api"
import {AppLabelEnum, AppIcons, AppType, AppVisibility} from "@/lib/constants/constants"
import { useSpaceApi } from "@/hooks/use-space-api"
import { useParams, useNavigate } from "react-router-dom"
// import { FilesTab } from "@/app/front/space/components/files-tab"
import { MembersTab } from "@/app/front/space/components/members-tab"
import EmojiPicker from "@/components/emoji/EmojiPicker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import ShareDialog from "@/components/sharev2";
import {useVisibility} from "@/hooks/use-visibility";
import {usePermission} from "@/hooks/use-permission";
import { useTranslation } from "react-i18next"

// Form schema for validation
const formSchema = z.object({
  icon: z.string().optional(),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  type: z.enum(["1", "2", "3", "4"]),
  copilotPrompt: z.string().optional(),
  visibility: z.enum(["1", "2"]),
})

// Helper function to get workspace type icon
const getWorkspaceIcon = (type: AppType) => {
  const appIconConfig = AppIcons[type];
  if (!appIconConfig) {
    // If the specified type doesn't exist in AppIcons, handle it here
    console.warn(`Icon configuration for type ${type} not found.`);
    return null;
  }
  const AppIcon = appIconConfig.icon;
  return <AppIcon className="h-5 w-5" style={{ color: appIconConfig?.color }} />
}

export default function SpaceSettings() {
  const { t } = useTranslation()
  const [space, setSpace] = useState<Space | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { onUpdate: handleSpaceUpdate, onDelete: handleSpaceDelete } = useSpaceApi()
  const { appId } = useParams();
  const navigate = useNavigate();
  const { visibility,setVisibility, handleVisibilityChange } = useVisibility(1, appId!, '');
  const { permission,setPermission, handlePermissionChange } = usePermission(1,1, appId!,'');


  // Initialize form with zod resolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      icon: "",
      name: "",
      description: "",
      type: "2",
      copilotPrompt: "",
    },
  })

  // Fetch space data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const spaceData = await ApiAppInfo(appId!);
        setSpace(spaceData)
        setVisibility(spaceData.visibility);
        setPermission(spaceData.permission);
        // Set form values
        form.reset({
          icon: spaceData.icon || "",
          name: spaceData.name,
          description: spaceData.description || "",
          type: spaceData.type.toString() as "1" | "2" | "3" | "4",
          copilotPrompt: spaceData.copilotPrompt || "",
        })

        setLoading(false)
      } catch (error) {
        console.error("Error fetching space data:", error)
        toast({
          title: "Error",
          description: "Failed to load space settings",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchData()
  }, [form, appId])

  // useEffect(() => {
  //     if (space) {
  //         handleVisibilityChange(space.visibility);
  //     }
  // }, [space]);

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setSaving(true)

      // Convert string values to numbers
      await handleSpaceUpdate(appId!, {
        icon: data.icon,
        name: data.name,
        description: data.description,
        copilotPrompt: data.copilotPrompt,
      })

      toast({
        title: "Success",
        description: "Space settings updated successfully",
      })
    } catch (error) {
      console.error("Error updating space:", error)
      toast({
        title: "Error",
        description: "Failed to update space settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // Handle space deletion
  const onDelete = async () => {
    try {
      setDeleting(true);
      await handleSpaceDelete(appId!);
      toast({
        title: "Success",
        description: "Space deleted successfully",
      });
      // Navigate back to spaces list after deletion
      navigate("/home");
    } catch (error) {
      console.error("Error deleting space:", error);
      toast({
        title: "Error",
        description: "Failed to delete space",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    form.setValue("icon", emoji);
    setShowEmojiPicker(false);
  }

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t("space-page.Loading settings")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("space-page.Space Settings")}</h1>
          <p className="text-muted-foreground">
            {t("space-page.Manage your")} {space?.type ? t("constant." + AppLabelEnum[space.type]): "workspace"} {t("space-page.settings")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
          >
            {t("space-page.Delete Space")}
          </Button>
          {space?.type && (
            <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
              {getWorkspaceIcon(space.type)}
              <span>{t("constant." + AppLabelEnum[space.type])}</span>
            </Badge>
          )}
          <Badge variant={space?.visibility === 1 ? "secondary" : "outline"} className="px-3 py-1">
            {space?.visibility === 1 ? t("space-page.Private") : t("space-page.Public")}
          </Badge>

        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Tabs defaultValue="general" className="w-full flex flex-col md:flex-row gap-6">
          <div className="md:w-48 lg:w-64 shrink-0">
            <TabsList className="flex flex-row md:flex-col w-full h-auto bg-muted/50 p-1 rounded-md">
              <TabsTrigger
                value="general"
                className="flex items-center justify-start w-full py-3 px-4 data-[state=active]:bg-background"
              >
                {t("space-page.General")}
              </TabsTrigger>
              {Number.parseInt(form.watch("type")) === 1 && (
                <TabsTrigger
                  value="files"
                  className="flex items-center justify-start w-full py-3 px-4 data-[state=active]:bg-background"
                >
                  {t("space-page.Files")}
                </TabsTrigger>
              )}
                <TabsTrigger
                  value="members"
                  className="flex items-center justify-start w-full py-3 px-4 data-[state=active]:bg-background"
                >
                  {t("space-page.Members")}
                </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1">
            <TabsContent value="general" className="mt-0">
              <Card>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader>
                      <CardTitle>{t("space-page.General Settings")}</CardTitle>
                      <CardDescription>{t("space-page.Update your space information")}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="icon"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("space-page.Icon")}</FormLabel>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                className="w-12 h-12 flex items-center justify-center text-2xl"
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                              >
                                {field.value ? field.value : getWorkspaceIcon(space?.type!)}
                              </Button>
                              <div className="relative">
                                {showEmojiPicker && (
                                  <div className="absolute z-10 mt-1">
                                    <EmojiPicker
                                      onEmojiSelect={handleEmojiSelect}
                                      onClose={() => setShowEmojiPicker(false)}
                                    />
                                  </div>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {t("space-page.Click to select an emoji")}
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("space-page.Name")}</FormLabel>
                            <FormControl>
                              <Input placeholder={t("space-page.Enter space name")} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("space-page.Description")}</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={t("space-page.Enter space description")}
                                className="resize-none min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>{t("space-page.Briefly describe")}</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("space-page.Type")}</FormLabel>
                              <Select disabled onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={t("space-page.Select space type")} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1" className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-orange-500" />
                                    <span>{t("space-page.Chat")}</span>
                                  </SelectItem>
                                  <SelectItem value="2" className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-blue-500" />
                                    <span>{t("space-page.ChatPDF")}</span>
                                  </SelectItem>
                                  <SelectItem value="3" className="flex items-center gap-2">
                                    <Brain className="h-4 w-4 text-purple-500" />
                                    <span>{t("space-page.Brainstorm")}</span>
                                  </SelectItem>
                                    {/*<SelectItem value="4" className="flex items-center gap-2">*/}
                                    {/*    <Database className="h-4 w-4 text-emerald-500" />*/}
                                    {/*    <span>{t("space-page.KnowledgeBase")}</span>*/}
                                    {/*</SelectItem>*/}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/*<FormField*/}
                        {/*  control={form.control}*/}
                        {/*  name="visibility"*/}
                        {/*  render={({ field }) => (*/}
                        {/*    <FormItem>*/}
                        {/*      <FormLabel>Visibility</FormLabel>*/}
                        {/*      <Select onValueChange={field.onChange} defaultValue={field.value}>*/}
                        {/*        <FormControl>*/}
                        {/*          <SelectTrigger>*/}
                        {/*            <SelectValue placeholder="Select visibility" />*/}
                        {/*          </SelectTrigger>*/}
                        {/*        </FormControl>*/}
                        {/*        <SelectContent>*/}
                        {/*          <SelectItem value="1" className="flex items-center gap-2">*/}
                        {/*            <Users className="h-4 w-4" />*/}
                        {/*            <span>Private</span>*/}
                        {/*          </SelectItem>*/}
                        {/*          <SelectItem value="2" className="flex items-center gap-2">*/}
                        {/*            <Users className="h-4 w-4" />*/}
                        {/*            <span>Public</span>*/}
                        {/*          </SelectItem>*/}
                        {/*        </SelectContent>*/}
                        {/*      </Select>*/}
                        {/*      <FormDescription>*/}
                        {/*        {Number.parseInt(field.value) === 1*/}
                        {/*          ? "Only invited members can access this space"*/}
                        {/*          : "Anyone in the team can access this space"}*/}
                        {/*      </FormDescription>*/}
                        {/*      <FormMessage />*/}
                        {/*    </FormItem>*/}
                        {/*  )}*/}
                        {/*/>*/}
                      </div>

                      {Number.parseInt(form.watch("type")) === 2 && (
                        <FormField
                          control={form.control}
                          name="copilotPrompt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("space-page.Copilot Prompt")}</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder={t("space-page.Enter instructions")}
                                  className="resize-none min-h-[150px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>{t("space-page.Define how")}</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button type="submit" disabled={saving}>
                        {saving ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                            {t("space-page.Saving")}
                          </>
                        ) : (
                          t("space-page.Save Changes")
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </TabsContent>

            {Number.parseInt(form.watch("type")) === 1 && (
              <TabsContent value="files" className="mt-0">
                {/* <FilesTab /> */}
              </TabsContent>
            )}
              <TabsContent value="members" className="mt-0">
                <ShareDialog
                    appId={appId!}
                    type={space?.type}
                    visibility={visibility}
                    permission={permission}
                    handleVisibilityChange={handleVisibilityChange}
                    handlePermissionChange={handlePermissionChange}
                />
              </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              {t("space-page.Delete Space")}
            </DialogTitle>
            <DialogDescription>
              {t("space-page.Delete confirmation")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-start">
            <Button
              type="button"
              variant="destructive"
              onClick={onDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                  {t("space-page.Deleting")}
                </>
              ) : (
                t("space-page.Yes Delete")
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting}
            >
              {t("space-page.Cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

