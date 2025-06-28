'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Shield, UserPen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UserAvatar } from '@/components/user-avatar'
import { useCurrentUser, useUserImage, useUserSignature, useRolesFromUser} from '@/features/users/hooks/use-users'
import { getInitials } from '@/lib/utils'
import { PageHeader } from '@/components/page-header'

export function ProfileList() {
  const { data: user, isLoading, error: userError } = useCurrentUser()
  const { data: userRoles } = useRolesFromUser(user?.igrpUsername)
  const { data: getImage } = useUserImage()
  const { data: getSignature } = useUserSignature()

  if (isLoading && !userError) return <div>Loading user...</div>
  if (userError) throw userError
  if (!user) return <div>No User found...</div>

  return (
    <div className='flex flex-col gap-6 animate-fade-in motion-reduce:hidden'>  
      <PageHeader title='User Profile' showBackButton linkBackButton='/users' />

      <div className='space-y-6'>
        <Card className='py-4'>
          <CardContent>
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
              <div className='flex gap-2 items-center'>
                <UserAvatar
                  image={getImage?.link}
                  alt={user.igrpUsername}
                  fallbackContent={getInitials(user.igrpUsername)}
                  className='h-18 w-18 bg-white/80'
                  fallbackClass='text-xl'
                />

                <div className='text-sm'>
                  <h2 className='font-bold mb-1'>{user.fullname || 'N/A'}</h2>
                  <p className='text-muted-foreground'>{user.igrpUsername}</p>
                </div>
              </div>

              <Button asChild>
                <Link href='/users/profile/edit'>
                  <UserPen className='mr-1' />
                  Edit
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className='space-y-6'>
          <Tabs defaultValue='overview' className='w-full'>
            <TabsList className='dark:bg-slate-900/50'>
              <TabsTrigger
                value='overview'
                className='dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-white'
              >
                Overview
              </TabsTrigger>
              {userRoles && userRoles.length > 0 && (
                <TabsTrigger
                  value='permissions'
                  className='dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-white'
                >
                  Permissions
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value='overview' className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle>User Information</CardTitle>
                  <CardDescription>Basic information</CardDescription>
                </CardHeader>
                <CardContent>
                  <dl className='grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm'>
                    <div className='flex flex-col gap-4'>
                      <div>
                        <dt className='font-medium text-muted-foreground'>Full Name</dt>
                        <dd>{user.fullname}</dd>
                      </div>
                      <div>
                        <dt className='font-medium text-muted-foreground'>Username</dt>
                        <dd>{user.igrpUsername}</dd>
                      </div>
                      <div>
                        <dt className='font-medium text-muted-foreground'>Email</dt>
                        <dd>{user.email}</dd>
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <dt className='font-medium text-muted-foreground'>Signature</dt>
                      <dd>
                        {getSignature?.link ? (
                          <Image
                            src={getSignature.link}
                            alt='Signature preview'
                            className='object-contain h-30 max-w-50 w-full bg-white/80 rounded-md'
                            width={300}
                            height={100}
                          />
                        ) : ('N/A')}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </TabsContent>

            {userRoles && userRoles.length > 0 && (
              <TabsContent value='permissions' className='mt-4'>
                <Card>
                  <CardHeader>
                    <CardTitle>User Permissions</CardTitle>
                    <CardDescription>Access and permissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      {userRoles.map((permission, index) => (
                        <div
                          key={index}
                          className='flex items-center justify-between rounded-lg border-b p-4'
                        >
                          <div className='flex items-center gap-4'>
                            <div className='rounded-full bg-primary/10 p-2'>
                              <Shield className='h-4 w-4 text-primary' />
                            </div>
                            <div>
                              <p className='font-medium capitalize'>{permission.replace(/_/g, ' ')}</p>
                            </div>
                          </div>
                          <Button variant='outline' size='sm'>
                            Revoke
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  )
}