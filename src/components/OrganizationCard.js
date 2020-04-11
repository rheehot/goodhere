import React from "react"
import { Link, graphql } from "gatsby"
import PropTypes from "prop-types"

import {
  OrganizationCategory,
  OrganizationLocation,
  OrganizationHeadcount,
  OrganizationOrgType,
  OrganizationCapitalType,
  OrganizationCapitalStrategic,
  OrganizationCapitalStage,
  OrganizationCapitalCheckSize,
} from "./OrganizationAttributes"

function getLogoImage({ logo, photos, categories }) {
  const cat =
    categories.find(c => c.cover) || categories.find(c => c?.parent?.cover)
  return logo || photos[0] || cat?.cover || cat?.parent.cover
}

export default function OrganizationCard({ categoryId, organization }) {
  const {
    title,
    description,
    hqLocation,
    slug,
    headcount,
    orgType,
    capitalProfile,
    categories,
  } = organization

  const subCategories = categoryId
    ? categories.filter(cat => cat.parent?.id === categoryId)
    : categories
  const img = getLogoImage(organization)

  return (
    <div className="OrganizationCard border-gray-400 border-b flex items-center py-4 text-gray-900">
      <div className="flex-grow self-center pr-8">
        <p>
          <Link to={slug} className="font-bold hover:text-teal-500 mr-2">
            {title}
          </Link>
          {description}
        </p>
        <div className="mt-1">
          {capitalProfile?.type?.map(type => (
            <OrganizationCapitalType key={type} text={type} />
          ))}
          {capitalProfile?.strategic && (
            <OrganizationCapitalStrategic key="capitalstrategic" />
          )}
          {capitalProfile?.stage && (
            <OrganizationCapitalStage
              key="stage"
              stages={capitalProfile?.stage}
            />
          )}
          {capitalProfile?.checkSize && (
            <OrganizationCapitalCheckSize
              key="checkSize"
              checkSizes={capitalProfile?.checkSize}
            />
          )}
          {subCategories?.map(category => (
            <OrganizationCategory key={category.name} text={category.name} />
          ))}
          {hqLocation && <OrganizationLocation location={hqLocation} />}
          {headcount && (
            <OrganizationHeadcount key="headcount" text={headcount} />
          )}
          {orgType && <OrganizationOrgType key="orgtype" text={orgType} />}
        </div>
      </div>
      <div className="w-24 flex-shrink-0 hidden sm:block">
        {img && (
          <Link to={slug}>
            <img
              src={img.src}
              alt={`${title} logo`}
              className="OrganizationCard-logo blend-multiply rounded-lg w-24 h-24"
              loading="lazy"
            />
          </Link>
        )}
      </div>
    </div>
  )
}

OrganizationCard.propTypes = {
  organization: PropTypes.object,
}

// Includes all the expected attributes for rendering an OrganizationCard. To
// query Capital Profile information, use the CapitalOrganizationCard fragment
export const query = graphql`
  fragment OrganizationCardLogo on AirtableField {
    localFiles {
      childImageSharp {
        resize(width: 256, height: 256, fit: CONTAIN, background: "white") {
          src
        }
      }
    }
  }

  fragment OrganizationCardPhoto on AirtableField {
    localFiles {
      childImageSharp {
        resize(width: 256, height: 256, fit: COVER) {
          src
        }
      }
    }
    internal {
      content
    }
  }

  fragment OrganizationCard on Airtable {
    data {
      Name
      Homepage
      About
      Tagline
      HQ_Location
      HQ_Country
      HQ_Region
      HQ_Locality
      Organization_Type
      Headcount
      Role
      Photos {
        ...OrganizationCardPhoto
      }
      Categories {
        id
        data {
          Name
          Cover {
            ...OrganizationCardPhoto
          }
          Parent {
            id
            data {
              Name
              Cover {
                ...OrganizationCardPhoto
              }
            }
          }
        }
      }
      Logo {
        ...OrganizationCardLogo
      }
      Crunchbase_ODM {
        data {
          Logo {
            ...OrganizationCardLogo
          }
        }
      }
      LinkedIn_Profiles {
        data {
          Logo {
            ...OrganizationCardLogo
          }
        }
      }
    }
  }

  fragment CapitalOrganizationCard on Airtable {
    ...OrganizationCard
    data {
      Capital_Profile {
        data {
          Type
          Strategic
          ImpactSpecific: Impact_Specific
          Stage
          CheckSize: Check_Size
        }
      }
    }
  }
`
