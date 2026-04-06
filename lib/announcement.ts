import { ANNOUNCEMENT_ROUTES } from '@/constants/announcement';
import { MetaData, RentForApartmentsForm } from '@/types/announcement';
import { AnnouncementPublicationResponse } from './api/applications';

export type AnnouncementRoutePath =
  (typeof ANNOUNCEMENT_ROUTES)[keyof typeof ANNOUNCEMENT_ROUTES]['path'];

const ROUTES = Object.values(ANNOUNCEMENT_ROUTES);

export const getTargetRoute = (step: number): AnnouncementRoutePath => {
  const route = ROUTES.find((r) => r.completedStep === step);
  return (route?.path ?? ANNOUNCEMENT_ROUTES.RENT_BASIC_INFO.path) as AnnouncementRoutePath;
};

export const getTargetStep = (path: string): number | undefined => {
  const route = ROUTES.find((r) => r.path === path);
  return route?.completedStep;
};

export const getParsedAnnouncementData = (
  response: AnnouncementPublicationResponse
): { formData: RentForApartmentsForm; metaData: MetaData } => {
  try {
    const mediaFileIds: string[] = [];
    const tempMediaFiles: { id: string; uri: string; type?: string; name?: string }[] = [];

    response.mediaFiles.forEach((media) => {
      mediaFileIds.push(media.id);
      tempMediaFiles.push({
        id: media.id,
        uri: media.url,
        type: media.fileType,
        name: media.fileName,
      });
    });

    return {
      metaData: {
        response: {
          id: response.id,
          publicId: response.publicId,
          status: response.status,
          createdAt: response.createdAt,
          createdBy: response.createdBy,
          applicantEmail: response.applicantEmail,
        },
        tempMediaFiles,
        brokerId: response.assignedBrokerId,
      },
      formData: {
        stepNumber: response.stepNumber,
        listingType: response.listingType,
        geo: response.geo,
        propertyType: response.propertyType,
        processType: response.processType,
        needPhotographer: response.needPhotographer,
        needAssessmentExpert: response.needAssessmentExpert,
        infrastructureObjects: response.infrastructureObjects,
        property: response.property,
        description: response.description,
        rentDetails: response.rentDetails,
        mediaFileIds,
        documentIds: response.documentIds,
        title: response.title,
        brokerAssignmentNeeded: response.brokerAssignmentNeeded,
      },
    };
  } catch (error) {
    throw error;
  }
};
