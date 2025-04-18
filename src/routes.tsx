import {
  createBrowserRouter, RouterProvider, Route,
  createRoutesFromElements, Navigate
} from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Loading from './components/loading';
import Layout1 from '@/app/layout';
import { ErrorBoundary } from './components/error-boundary';
import TeamPreferencesPage from "@/app/admin/preference/page";

const Component2 = lazy(() => import('@/app/auth/login/page'));
const Component3 = lazy(() => import('@/app/auth/register/page'));
const Layout4 = lazy(() => import('@/app/front/layout'));
const Component5 = lazy(() => import('@/app/front/aichat/page'));
const Component6 = lazy(() => import('@/app/front/aichat/info/page'));
const Component9 = lazy(() => import('@/app/front/dataset/docList/page'));
const Component10 = lazy(() => import('@/app/front/dataset/docPageList/page'));
const ChatPDF = lazy(() => import('@/app/front/chatpdf/page'));
const ChatPDFInfo = lazy(() => import('@/app/front/chatpdf/info/page'));
const HomePage = lazy(() => import('@/app/front/home/page'));
const Meeting = lazy(() => import('@/app/front/meeting/page'));
const MeetingInfo = lazy(() => import('@/app/front/meeting/info/page'));
const SpaceSetting = lazy(() => import('@/app/front/space/page'));
const NotePage = lazy(() => import('@/app/front/note/page'));
const NoteInfoPage = lazy(() => import('@/app/front/note/info/page'));
const NotFound = lazy(() => import('@/app/not-found'));
const EmployeePage = lazy(() => import('@/app/front/employee/page'));

const AdminLayout = lazy(() => import('@/app/admin/layout'));
const AdminOverview = lazy(() => import('@/app/admin/overview/page'));
const AdminApplication = lazy(() => import('@/app/admin/application/page'));
const AdminModelProvider = lazy(() => import('@/app/admin/modelProvider/page'));
const AdminTeamMember = lazy(() => import('@/app/admin/teamMember/page'));
const AdminSetting = lazy(() => import('@/app/admin/setting/page'));
const AdminTeamPreferences = lazy(() => import('@/app/admin/preference/page'));
const AdminLicense = lazy(() => import('@/app/admin/license/page'));


const UserSettingLayout = lazy(() => import('@/app/userSetting/layout'));
const UserSettingGeneral = lazy(() => import('@/app/userSetting/general/general'));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={<Layout1 />}
      errorElement={
        <ErrorBoundary />
      }
    >
      <Route
        path="/login"
        element={
          <Suspense fallback={<Loading />}>
            <Component2 />
          </Suspense>
        } />
      <Route
        path="/register"
        element={
          <Suspense fallback={<Loading />}>
            <Component3 />
          </Suspense>
        } />
      <Route
        element={
          <Suspense fallback={<Loading />}>
            <Layout4 />
          </Suspense>
        }>
        <Route
          path="/home"
          element={
            <Suspense fallback={<Loading />}>
              <HomePage />
            </Suspense>
          }>
        </Route>
        <Route
          path="/assistant"
          element={
            <Suspense fallback={<Loading />}>
              <EmployeePage />
            </Suspense>
          } />

        <Route
          path="/dataset/:datasetId/docList"
          element={
            <Suspense fallback={<Loading />}>
              <Component9 />
            </Suspense>
          } />

        <Route
          path="/dataset/:datasetId/docPageList/:fileId"
          element={
            <Suspense fallback={<Loading />}>
              <Component10 />
            </Suspense>
          } />
        <Route
          path="/:sType/:appId/setting"
          element={
            <Suspense fallback={<Loading />}>
              <SpaceSetting />
            </Suspense>
          } />
        <Route
          index
          path={`/s/:appId`}
          element={
            <Suspense fallback={<Loading />}>
              <Component5 />
            </Suspense>
          } />
        <Route
          index
          path={`/s/:appId/c/:channelId`}
          element={
            <Suspense fallback={<Loading />}>
              <Component6 />
            </Suspense>
          } />
      <Route
          path="/note/:appId"
          element={
              <Suspense fallback={<Loading />}>
                  <NotePage />
              </Suspense>
          }>
      </Route>
      <Route
          path="/note/:appId/c/:channelId"
          element={
              <Suspense fallback={<Loading />}>
                  <NoteInfoPage />
              </Suspense>
          }>
      </Route>
        <Route
          path="/chatpdf/:appId"
          element={
            <Suspense fallback={<Loading />} >
              <ChatPDF />
            </Suspense>
          } />
        <Route
          path="/chatpdf/:appId/c/:channelId"
          element={
            <Suspense fallback={<Loading />} >
              <ChatPDFInfo />
            </Suspense>
          } />

        <Route
          path="/chatpdf/:appId/:channelId"
          element={
            <Suspense fallback={<Loading />} >
              <ChatPDF />
            </Suspense>
          } />

        <Route
          path="/meeting/:appId"
          element={
            <Suspense fallback={<Loading />} >
              <Meeting />
            </Suspense>
          } />
        <Route
          path="/meeting/:appId/c/:channelId"
          element={
            <Suspense fallback={<Loading />} >
              <MeetingInfo />
            </Suspense>
          } />

        <Route path='/' element={<Navigate to={'/home'} />} />
      </Route>
      {/* admin */}
      <Route
        element={
          <Suspense fallback={<Loading />}>
            <AdminLayout />
          </Suspense>
        }>
        <Route
          path="/admin/overview"
          element={
            <Suspense fallback={<Loading />} >
              <AdminOverview />
            </Suspense>
          } />
        <Route
          path="/admin/application"
          element={
            <Suspense fallback={<Loading />} >
              <AdminApplication />
            </Suspense>
          } />
        <Route
          path="/admin/modelProvider"
          element={
            <Suspense fallback={<Loading />} >
              <AdminModelProvider />
            </Suspense>
          } />
        <Route
          path="/admin/teamMember"
          element={
            <Suspense fallback={<Loading />} >
              <AdminTeamMember />
            </Suspense>
          } />
        <Route
          path="/admin/license"
          element={
            <Suspense fallback={<Loading />} >
              <AdminLicense />
            </Suspense>
          } />
        <Route
          path="/admin/setting"
          element={
            <Suspense fallback={<Loading />} >
              <AdminSetting />
            </Suspense>
          } />
          <Route
              path="/admin/preference"
              element={
                  <Suspense fallback={<Loading />} >
                      <AdminTeamPreferences />
                  </Suspense>
              } />
      </Route>
      {/* user setting */}
      <Route
        element={
          <Suspense fallback={<Loading />}>
            <UserSettingLayout />
          </Suspense>
        }>
        <Route
          path="/userSetting/general"
          element={
            <Suspense fallback={<Loading />} >
              <UserSettingGeneral />
            </Suspense>
          } />
      </Route>

      <Route
        path="*"
        element={
          <Suspense fallback={<Loading />}>
            <NotFound />
          </Suspense>
        } />
    </Route>
  )
);

export default function Router() {
  return <RouterProvider router={router} />;
}