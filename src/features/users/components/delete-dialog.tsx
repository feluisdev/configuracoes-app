'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface MenuDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userName: string
  onDelete: () => void
}

export function UserDeleteDialog({ open, onOpenChange, userName, onDelete }: MenuDeleteDialogProps) {
  const [confirmation, setConfirmation] = useState('')
  const isConfirmed = confirmation === userName

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the user and all its data.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4 py-2'>
          <p>
            To confirm, type <span className='text-destructive'>{userName}</span> below:
          </p>
          <div className='space-y-2'>
            <Label htmlFor='confirmation'>Confirmation</Label>
            <Input
              id='confirmation'
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder={`Type '${userName}' to confirm`}
              className='w-full'
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant='destructive' onClick={onDelete} disabled={!isConfirmed}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
