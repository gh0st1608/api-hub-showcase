import { Injectable } from '@nestjs/common';
import { EventBusPort } from '@application/ports/event-bus.port';
import { DomainEvent } from '@domain/events/domain-event';
import {
  SNSClient,
  PublishCommand,
} from '@aws-sdk/client-sns';

/**
 * SnsEventBusAdapter
 * Adapter para publicar eventos en AWS SNS.
 * Encapsula la infraestructura AWS sin contaminar el dominio.
 */
@Injectable()
export class SnsEventBusAdapter implements EventBusPort {
  private readonly client: SNSClient;
  private readonly topicArn: string;

  constructor() {
    this.client = new SNSClient({
      region: process.env.AWS_REGION || 'us-east-1',
      endpoint: process.env.AWS_SNS_ENDPOINT, // para LocalStack si aplica
    });

    this.topicArn = process.env.AWS_SNS_TOPIC_ARN!;
  }

  async publish(event: DomainEvent): Promise<void> {
    try {
      const topic = event.constructor.name;

      const message = JSON.stringify(event.toEnvelope());

      const command = new PublishCommand({
        TopicArn: this.topicArn,
        Message: message,

        // metadata opcional (útil para routing o debugging)
        MessageAttributes: {
          eventType: {
            DataType: 'String',
            StringValue: topic,
          },
        },
      });

      console.log('Publicando evento a SNS:', {
        topicArn: this.topicArn,
        event: event.toEnvelope(),
      });

      await this.client.send(command);

    } catch (error) {
      console.error('Error publicando evento a SNS:', error);
      throw error;
    }
  }

  async publishAll(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }
}