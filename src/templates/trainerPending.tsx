import * as React from "react";
import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

import { parsePhoneNumber } from "libphonenumber-js";

import { encrypt } from "../utils/encryption";

export function TrainerPendingEmail(data: User) {
  const token = encrypt(`${data.id}::${data.email}`);

  const confirmationLink = `${process.env.FRONT_END_HOST}/trainer/confirm/${token}`;

  return (
    <Html>
      <Head />
      <Preview>
        {data.firstName} {data.lastName} se ha registrado como Entrenador
      </Preview>
      <Body style={styles.main}>
        <Container style={styles.container}>
          <Section style={styles.content}>
            <Section>
              <Column style={styles.logo_col}>
                <Img
                  src={`https://academia-dahilmar-saez-front-end.vercel.app/_next/image?url=%2Flogo.png&w=640&q=75`}
                  width="42"
                  height="42"
                  alt="academia-dahilmar-saez-logo"
                  style={styles.logo}
                />
              </Column>

              <Column align="left" style={styles.logo_text}>
                <Text>Academia Dahilmar Saez</Text>
              </Column>
            </Section>

            <Heading style={styles.heading}>Aprobación de Cuenta</Heading>

            <Text style={styles.paragraph}>
              <Text style={styles.label}>
                El usuario {data.firstName} {data.lastName} inició el proceso de
                registro para una cuenta Entrenador con los siguientes datos
              </Text>
            </Text>

            <Section>
              <Column style={styles.col}>
                <Text style={styles.paragraph}>
                  <Text style={styles.label}>Nombre</Text>
                  <Text style={styles.value}>
                    {data.firstName} {data.lastName}
                  </Text>
                </Text>
              </Column>
              <Column style={styles.col}>
                <Text style={styles.paragraph}>
                  <Text style={styles.label}>Cédula</Text>
                  <Text style={styles.value}>{data.documentID}</Text>
                </Text>
              </Column>
            </Section>

            <Section>
              <Column style={styles.col}>
                <Text style={styles.paragraph}>
                  <Text style={styles.label}>Email</Text>
                  <Link href={`mailto:${data.email}`} style={styles.link}>
                    {data.email}
                  </Link>
                </Text>
              </Column>
              <Column style={styles.col}>
                <Text style={styles.paragraph}>
                  <Text style={styles.label}>Teléfono</Text>
                  <Link
                    href={parsePhoneNumber(data.phone, "VE").getURI()}
                    style={styles.link}
                  >
                    {data.phone}
                  </Link>
                </Text>
              </Column>
            </Section>

            <Text style={styles.paragraph}>
              <Text style={styles.label}>
                Si desea aprobar la creacion de cuenta Entrenador por favor
                hacer clic en el siguiente enlace, de lo contrario ignore este
                mensaje
              </Text>
            </Text>

            <Text style={styles.message}>
              <Link href={confirmationLink} style={styles.link}>
                {confirmationLink}
              </Link>
            </Text>
          </Section>

          <Hr style={styles.hr} />

          <Section style={styles.footer}>
            <Text style={styles.footer_text}>
              ©2023 Academia Dahilmar Sáez. Todos los Derechos Reservados.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  main: {
    backgroundColor: "#ffffff",
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
    padding: "32px 0",
  },
  container: {
    margin: "0 auto",
    padding: "32px",
    width: "600px",
    backgroundColor: "#ffffff",
  },
  logo_col: {
    width: 42,
    height: 42,
  },
  logo: {
    width: 42,
    height: 42,
  },
  heading: {
    fontSize: "24px",
    letterSpacing: "-0.5px",
    lineHeight: "1.3",
    fontWeight: "400",
    color: "#484848",
    paddingTop: "32px",
  },
  label: {
    fontSize: "16px",
    fontWeight: "400",
    color: "#484848",
    lineHeight: "1.4",
  },
  paragraph: {
    marginBottom: "32px",
    fontSize: "16px",
    lineHeight: "1.4",
    color: "#484848",
  },
  message: {
    marginTop: "32px",
    marginBottom: "32px",
    fontSize: "16px",
    lineHeight: "1.4",
    color: "#484848",
    padding: "24px",
    backgroundColor: "#f3f4f6",
    borderRadius: "4px",
    wordBreak: "break-word",
  },
  link: {
    fontSize: "16px",
    color: "#f15a25",
    textDecoration: "none",
  },
  value: {
    fontSize: "16px",
    fontWeight: "400",
    color: "#262626",
    lineHeight: "1.4",
  },
  hr: {
    borderColor: "#dfe1e4",
    marginBottom: "16px",
  },
  content: {},
  footer: {},
  footer_text: {
    fontSize: "14px",
  },
  logo_text: {
    display: "table-cell",
    paddingLeft: "16px",
  },
  col: {
    display: "table-cell",
    width: "50%",
  },
} as { [key: string]: React.CSSProperties };
