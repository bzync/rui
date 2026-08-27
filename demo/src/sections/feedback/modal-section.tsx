import { useState } from "react"
import { Button } from "@bzync/rui"
import { Input } from "@bzync/rui"
import {
  Modal,
  ModalBody,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@bzync/rui"
import { Select } from "@bzync/rui"
import { Switch } from "@bzync/rui"
import { Section } from "../../_shared/section"
import { Group } from "../../_shared/group"
import { IconTrash } from "../../_shared/icons"

export function ModalSection() {
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <Section
      id="modal"
      title="Modal"
      description="Overlay dialog with spring entrance animation, backdrop blur, and ESC key support."
      importPath='import { Modal, ModalHeader, ModalBody, ModalFooter } from "@bzync/rui"'
      meta={["sm · md · lg · xl", "spring animation", "ESC to close"]}
    >
      <Group label="Demo">
        <Button onClick={() => setModalOpen(true)}>Open modal</Button>
        <Button variant="destructive" icon={<IconTrash />} onClick={() => setConfirmOpen(true)}>Delete project</Button>
      </Group>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <ModalHeader>
          <ModalTitle>Create new project</ModalTitle>
          <ModalDescription>Configure your new deployment. You can change these settings later.</ModalDescription>
        </ModalHeader>
        <ModalBody className="space-y-4">
          <Input label="Project name" placeholder="my-api" />
          <Select label="Region" placeholder="Choose a region" options={[{ value: "us-east-1", label: "US East (N. Virginia)" }, { value: "eu-west-1", label: "EU West (Ireland)" }]} />
          <Switch label="Auto-deploy on push" description="Trigger deployments when you push to main" defaultChecked />
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={() => setModalOpen(false)}>Create project</Button>
        </ModalFooter>
      </Modal>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} size="sm">
        <ModalHeader>
          <ModalTitle>Delete project</ModalTitle>
          <ModalDescription>This action is permanent and cannot be undone. All deployments, logs, and data will be removed.</ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={() => setConfirmOpen(false)}>Delete forever</Button>
        </ModalFooter>
      </Modal>
    </Section>
  )
}
