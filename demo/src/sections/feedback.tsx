import { AlertSection, SnackbarSection } from "./feedback/alert-snackbar-section"
import { SpinnerSection, SkeletonSection } from "./feedback/spinner-skeleton-section"
import { ModalSection } from "./feedback/modal-section"
import { ProgressbarSection } from "./feedback/progressbar-section"
import { ConfirmDialogSection, EmptyStateSection, ErrorStateSection } from "./feedback/confirm-empty-error-section"

export function FeedbackSection() {
  return (
    <>
      <AlertSection />
      <SnackbarSection />
      <SpinnerSection />
      <SkeletonSection />
      <ModalSection />
      <ProgressbarSection />
      <ConfirmDialogSection />
      <EmptyStateSection />
      <ErrorStateSection />
    </>
  )
}
