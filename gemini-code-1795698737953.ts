import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/HindSiliguri';

const { fontFamily } = loadFont();

// কালার প্যালেট (রেফারেন্স ভিডিও অনুযায়ী)
const COLORS = {
  bgLight: '#F5F2EB',
  bgDark: '#1B2028',
  amber: '#F4B41A',
  maroon: '#6B1A24',
  ink: '#1B2028',
  white: '#FFFFFF',
  red: '#D93829',
};

// ১. টপ প্রোগ্রেস বার এবং চ্যাপ্টার ব্যাজ
const TopHUD: React.FC<{ chapterNum: string; chapterTitle: string; dark?: boolean }> = ({
  chapterNum,
  chapterTitle,
  dark = false,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = (frame / durationInFrames) * 100;

  return (
    <>
      {/* টপ প্রোগ্রেস বার */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: 8,
          width: `${progress}%`,
          backgroundColor: COLORS.amber,
          zIndex: 50,
        }}
      />
      {/* টপ-রাইট চ্যাপ্টার ব্যাজ */}
      <div
        style={{
          position: 'absolute',
          top: 36,
          right: 48,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: dark ? COLORS.white : COLORS.ink,
          color: dark ? COLORS.ink : COLORS.white,
          padding: '8px 18px',
          borderRadius: 4,
          fontFamily,
          fontWeight: 700,
          fontSize: 22,
          boxShadow: `4px 4px 0px ${COLORS.amber}`,
          zIndex: 40,
        }}
      >
        <span
          style={{
            backgroundColor: COLORS.amber,
            color: COLORS.ink,
            padding: '2px 10px',
            marginRight: 10,
            borderRadius: 2,
          }}
        >
          {chapterNum}
        </span>
        {chapterTitle}
      </div>
    </>
  );
};

// ২. হাইলাইট টেক্সট কম্পোনেন্ট
const HighlightText: React.FC<{
  text: string;
  highlight: string;
  dark?: boolean;
  fontSize?: number;
}> = ({ text, highlight, dark = false, fontSize = 68 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      style={{
        fontFamily,
        fontSize,
        fontWeight: 700,
        color: dark ? COLORS.white : COLORS.ink,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        transform: `scale(${scale})`,
      }}
    >
      <span>{text}</span>
      {highlight && (
        <span
          style={{
            backgroundColor: COLORS.amber,
            color: COLORS.ink,
            padding: '4px 22px',
            borderRadius: 4,
            boxShadow: `5px 5px 0px ${dark ? '#000000' : COLORS.ink}`,
          }}
        >
          {highlight}
        </span>
      )}
    </div>
  );
};

// ৩. নিও-ব্রুটালিস্ট ইনফো কার্ড
const MotionCard: React.FC<{
  number?: string;
  title: string;
  subtitle?: string;
  delay?: number;
}> = ({ number, title, subtitle, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 13, stiffness: 140 },
  });

  const translateY = interpolate(anim, [0, 1], [60, 0]);

  return (
    <div
      style={{
        backgroundColor: COLORS.white,
        border: `3px solid ${COLORS.ink}`,
        boxShadow: `8px 8px 0px ${COLORS.ink}`,
        padding: '32px 28px',
        width: 380,
        borderRadius: 6,
        fontFamily,
        transform: `translateY(${translateY}px) scale(${anim})`,
        opacity: anim,
      }}
    >
      {number && (
        <div
          style={{
            display: 'inline-block',
            backgroundColor: COLORS.amber,
            color: COLORS.ink,
            fontWeight: 700,
            fontSize: 28,
            padding: '4px 16px',
            border: `2px solid ${COLORS.ink}`,
            marginBottom: 16,
          }}
        >
          {number}
        </div>
      )}
      <div style={{ fontSize: 38, fontWeight: 700, color: COLORS.ink, lineHeight: 1.25 }}>
        {title}
      </div>
      {subtitle && (
        <div style={{ fontSize: 24, color: '#4A5568', marginTop: 10 }}>{subtitle}</div>
      )}
    </div>
  );
};

// ৪. চ্যাপ্টার কার্টেন ট্রানজিশন (মেরুন পর্দা)
const CurtainTransition: React.FC<{ num: string; title: string }> = ({ num, title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.maroon,
        backgroundImage:
          'repeating-linear-gradient(90deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 24px, transparent 24px, transparent 48px)',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily,
      }}
    >
      <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.7} />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          transform: `scale(${pop})`,
        }}
      >
        <span
          style={{
            backgroundColor: COLORS.amber,
            color: COLORS.ink,
            fontSize: 54,
            fontWeight: 700,
            padding: '8px 24px',
            borderRadius: 4,
          }}
        >
          {num}
        </span>
        <span style={{ color: COLORS.white, fontSize: 64, fontWeight: 700 }}>{title}</span>
      </div>
    </AbsoluteFill>
  );
};

// ৫. ফ্লোটিং কাটআউট ইমেজ কম্পোনেন্ট
const CutoutVisual: React.FC<{
  src: string;
  label?: string;
  side?: 'left' | 'right';
}> = ({ src, label, side = 'left' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 15 } });
  const floatY = Math.sin(frame / 15) * 8;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: `translateY(${floatY}px) scale(${enter})`,
      }}
    >
      <div
        style={{
          border: `4px solid ${COLORS.ink}`,
          boxShadow: `10px 10px 0px ${COLORS.amber}`,
          borderRadius: 12,
          overflow: 'hidden',
          backgroundColor: COLORS.white,
        }}
      >
        <Img
          src={staticFile(src)}
          style={{ width: 420, height: 420, objectFit: 'cover', display: 'block' }}
        />
      </div>
      {label && (
        <div
          style={{
            marginTop: 20,
            backgroundColor: COLORS.ink,
            color: COLORS.white,
            fontFamily,
            fontSize: 28,
            fontWeight: 700,
            padding: '8px 24px',
            borderRadius: 4,
            border: `2px solid ${COLORS.amber}`,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};

// মূল ভিডিও কম্পোজিশন
export const ExplainerVideo: React.FC = () => {
  const frame = useCurrentFrame();

  // ডাইনামিক কাউন্টার (যেমন: 0+ থেকে 740+)
  const counterVal = Math.min(740, Math.floor(interpolate(frame - 360, [0, 60], [0, 740], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })));

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgLight }}>
      {/* মাস্টার ভয়েসওভার ও ব্যাকগ্রাউন্ড মিউজিক */}
      <Audio src={staticFile('voiceover.mp3')} volume={1.0} />
      <Audio src={staticFile('bgm.mp3')} volume={0.16} loop />

      {/* সিন ১: হুক ও প্রোডাক্ট ইন্ট্রো (০ - ৫ সেকেন্ড | ফ্রেম ০ - ১৫০) */}
      <Sequence from={0} durationInFrames={150}>
        <AbsoluteFill
          style={{
            backgroundColor: COLORS.bgLight,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: '0 90px',
          }}
        >
          <Audio src={staticFile('sfx/pop.mp3')} volume={0.6} />
          <CutoutVisual src="product1.png" label="হানি নাটস (Honey Nuts)" />
          <div style={{ maxWidth: 850 }}>
            <HighlightText text="সাধারণ খাবার নাকি" highlight="একটি ব্র্যান্ড?" fontSize={64} />
            <p
              style={{
                fontFamily,
                fontSize: 34,
                color: '#333',
                marginTop: 28,
                lineHeight: 1.5,
              }}
            >
              মধু আর বাদামের একটি কাঁচের বয়াম কীভাবে তৈরি করল বাংলাদেশের অন্যতম পরিচিত ফুড ব্র্যান্ডের পরিচয়!
            </p>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* সিন ২: ডার্ক প্রশ্ন স্লাইড (৫ - ৯ সেকেন্ড | ফ্রেম ১৫০ - ২৭০) */}
      <Sequence from={150} durationInFrames={120}>
        <AbsoluteFill
          style={{
            backgroundColor: COLORS.bgDark,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
          <HighlightText text="অথচ মজার ব্যাপার" highlight="কী জানেন?" dark fontSize={76} />
        </AbsoluteFill>
      </Sequence>

      {/* সিন ৩: অ্যানিমেটেড কাউন্টার কার্ড (৯ - ১৪ সেকেন্ড | ফ্রেম ২৭০ - ৪২০) */}
      <Sequence from={270} durationInFrames={150}>
        <AbsoluteFill
          style={{
            backgroundColor: COLORS.bgLight,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Audio src={staticFile('sfx/pop.mp3')} volume={0.6} />
          <div
            style={{
              backgroundColor: COLORS.white,
              border: `4px solid ${COLORS.ink}`,
              boxShadow: `12px 12px 0px ${COLORS.amber}`,
              padding: '50px 90px',
              textAlign: 'center',
              fontFamily,
            }}
          >
            <div style={{ fontSize: 36, fontWeight: 700, color: COLORS.ink, marginBottom: 16 }}>
              ফেসবুকে সক্রিয় বিজ্ঞাপন
            </div>
            <div style={{ fontSize: 120, fontWeight: 700, color: COLORS.ink }}>
              {counterVal}+
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* সিন ৪: চ্যাপ্টার কার্টেন ট্রানজিশন (১৪ - ১৬.৫ সেকেন্ড | ফ্রেম ৪২০ - ৪৯৫) */}
      <Sequence from={420} durationInFrames={75}>
        <CurtainTransition num="০১" title="মানুষটা কে?" />
      </Sequence>

      {/* সিন ৫: উদ্যোক্তা পরিচিতি (১৬.৫ - ২২.৫ সেকেন্ড | ফ্রেম ৪৯৫ - ৬৭৫) */}
      <Sequence from={495} durationInFrames={180}>
        <AbsoluteFill
          style={{
            backgroundColor: COLORS.bgLight,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: '0 90px',
          }}
        >
          <Audio src={staticFile('sfx/pop.mp3')} volume={0.6} />
          <CutoutVisual src="person1.png" label="জামশেদ মজুমদার" />
          <div style={{ maxWidth: 850 }}>
            <HighlightText text="ব্র্যান্ডের পেছনের" highlight="মাস্টারমাইন্ড" fontSize={60} />
            <div style={{ display: 'flex', gap: 24, marginTop: 40 }}>
              <MotionCard number="১" title="সততা ও বিশ্বাস" subtitle="ব্যবসার সবচেয়ে বড় পুঁজি" delay={10} />
              <MotionCard number="২" title="ব্র্যান্ড রিকল" subtitle="নাম শুনলেই মুখ ভেসে ওঠা" delay={25} />
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* গ্লোবাল HUD */}
      <TopHUD chapterNum="০১" chapterTitle="শুরুর গল্প" />
    </AbsoluteFill>
  );
};